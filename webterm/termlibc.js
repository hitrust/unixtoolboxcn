
var Terminal=function(conf){if(typeof conf!='object')conf=new Object();else{for(var i in this.Defaults){if(typeof conf[i]=='undefined')conf[i]=this.Defaults[i];}}
this.conf=conf;this.setInitValues();}
Terminal.prototype={version:'1.4 (original)',Defaults:{cols:80,rows:24,x:100,y:100,termDiv:'termDiv',bgColor:'#181818',frameColor:'#555555',frameWidth:1,rowHeight:15,blinkDelay:500,fontClass:'term',crsrBlinkMode:false,crsrBlockMode:true,DELisBS:false,printTab:true,printEuro:true,catchCtrlH:true,closeOnESC:true,historyUnique:false,id:0,ps:'>',greeting:'%+r Terminal ready. %-r',handler:this.defaultHandler,ctrlHandler:null,initHandler:null,exitHandler:null,wrap:false},setInitValues:function(){this.isSafari=(navigator.userAgent.indexOf('Safari')>=0)?true:false;this.id=this.conf.id;this.maxLines=this.conf.rows;this.maxCols=this.conf.cols;this.termDiv=this.conf.termDiv;this.crsrBlinkMode=this.conf.crsrBlinkMode;this.crsrBlockMode=this.conf.crsrBlockMode;this.blinkDelay=this.conf.blinkDelay;this.DELisBS=this.conf.DELisBS;this.printTab=this.conf.printTab;this.printEuro=this.conf.printEuro;this.catchCtrlH=this.conf.catchCtrlH;this.closeOnESC=this.conf.closeOnESC;this.historyUnique=this.conf.historyUnique;this.ps=this.conf.ps;this.closed=false;this.r;this.c;this.charBuf=new Array();this.styleBuf=new Array();this.scrollBuf=null;this.blinkBuffer=0;this.blinkTimer;this.cursoractive=false;this.lock=true;this.insert=false;this.charMode=false;this.rawMode=false;this.lineBuffer='';this.inputChar=0;this.lastLine='';this.guiCounter=0;this.history=new Array();this.histPtr=0;this.env=new Object();this.ns4ParentDoc=null;this.handler=this.conf.handler;this.wrapping=this.conf.wrapping;this.ctrlHandler=this.conf.ctrlHandler;this.initHandler=this.conf.initHandler;this.exitHandler=this.conf.exitHandler;},defaultHandler:function(){this.newLine();if(this.lineBuffer!=''){this.type('You typed: '+this.lineBuffer);this.newLine();}
this.prompt();},open:function(){if(this.termDivReady()){if(!this.closed)this._makeTerm();this.init();return true;}
else return false;},close:function(){this.lock=true;this.cursorOff();if(this.exitHandler)this.exitHandler();this.globals.setVisible(this.termDiv,0);this.closed=true;},init:function(){if(this.guiReady()){this.guiCounter=0;if(this.closed){this.setInitValues();}
this.clear();this.globals.setVisible(this.termDiv,1);this.globals.enableKeyboard(this);if(this.initHandler){this.initHandler();}
else{this.write(this.conf.greeting);this.newLine();this.prompt();}}
else{this.guiCounter++;if(this.guiCounter>18000){if(confirm('Terminal:\nYour browser hasn\'t responded for more than 2 minutes.\nRetry?'))this.guiCounter=0
else return;};this.globals.termToInitialze=this;window.setTimeout('Terminal.prototype.globals.termToInitialze.init()',500);}},getRowArray:function(l,v){var a=new Array();for(var i=0;i<l;i++)a[i]=v;return a;},wrapOn:function(){this.wrapping=true;},wrapOff:function(){this.wrapping=false;},type:function(text,style){for(var i=0;i<text.length;i++){var ch=text.charCodeAt(i);if(!this.isPrintable(ch))ch=94;this.charBuf[this.r][this.c]=ch;this.styleBuf[this.r][this.c]=(style)?style:0;var last_r=this.r;this._incCol();if(this.r!=last_r)this.redraw(last_r);}
this.redraw(this.r)},write:function(text,usemore){if(typeof text!='object'){if(typeof text!='string')text=''+text;if(text.indexOf('\n')>=0){var ta=text.split('\n');text=ta.join('%n');}}
else{if(text.join)text=text.join('%n')
else text=''+text;if(text.indexOf('\n')>=0){var ta=text.split('\n');text=ta.join('%n');}}
this._sbInit(usemore);var chunks=text.split('%');var esc=(text.charAt(0)!='%');var style=0;var styleMarkUp=this.globals.termStyleMarkup;for(var i=0;i<chunks.length;i++){if(esc){if(chunks[i].length>0)this._sbType(chunks[i],style)
else if(i>0)this._sbType('%',style);esc=false;}
else{var func=chunks[i].charAt(0);if((chunks[i].length==0)&&(i>0)){this._sbType("%",style);esc=true;}
else if(func=='n'){this._sbNewLine(true);if(chunks[i].length>1)this._sbType(chunks[i].substring(1),style);}
else if(func=='+'){var opt=chunks[i].charAt(1);opt=opt.toLowerCase();if(opt=='p')style=0
else if(styleMarkUp[opt])style|=styleMarkUp[opt];if(chunks[i].length>2)this._sbType(chunks[i].substring(2),style);}
else if(func=='-'){var opt=chunks[i].charAt(1);opt=opt.toLowerCase();if(opt=='p')style=0
else if(styleMarkUp[opt])style&=~styleMarkUp[opt];if(chunks[i].length>2)this._sbType(chunks[i].substring(2),style);}
else if((chunks[i].length>1)&&(func=='c')){var cinfo=this._parseColor(chunks[i].substring(1));style=(style&(~0xfffff0))|cinfo.style;if(cinfo.rest)this._sbType(cinfo.rest,style);}
else if((chunks[i].length>1)&&(chunks[i].charAt(0)=='C')&&(chunks[i].charAt(1)=='S')){this.clear();this._sbInit();if(chunks[i].length>2)this._sbType(chunks[i].substring(2),style);}
else{if(chunks[i].length>0)this._sbType(chunks[i],style);}}}
this._sbOut();},_parseColor:function(chunk){var rest='';var style=0;if(chunk.length){if(chunk.charAt(0)=='('){var clabel='';for(var i=1;i<chunk.length;i++){var c=chunk.charAt(i);if(c==')'){if(chunk.length>i)rest=chunk.substring(i+1);break;}
clabel+=c;}
if(clabel){if(clabel.charAt(0)=='@'){var sc=this.globals.nsColors[clabel.substring(1).toLowerCase()];if(sc)style=(16+sc)*0x100;}
else if(clabel.charAt(0)=='#'){var cl=clabel.substring(1).toLowerCase();var sc=this.globals.webColors[cl];if(sc){style=sc*0x10000;}
else{cl=this.globals.webifyColor(cl);if(cl)style=this.globals.webColors[cl]*0x10000;}}
else if((clabel.length)&&(clabel.length<=2)){var isHex=false;for(var i=0;i<clabel.length;i++){if(this.globals.isHexOnlyChar(clabel.charAt(i))){isHex=true;break;}}
var cl=(isHex)?parseInt(clabel,16):parseInt(clabel,10);if((!isNaN(cl))||(cl<=15)){style=cl*0x100;}}
else{style=this.globals.getColorCode(clabel)*0x100;}}}
else{var c=chunk.charAt(0);if(this.globals.isHexChar(c)){style=this.globals.hexToNum[c]*0x100;rest=chunk.substring(1);}
else{rest=chunk;}}}
return{rest:rest,style:style};},_sbInit:function(usemore){var sb=this.scrollBuf=new Object();var sbl=sb.lines=new Array();var sbs=sb.styles=new Array();sb.more=usemore;sb.line=0;sb.status=0;sb.r=0;sb.c=this.c;sbl[0]=this.getRowArray(this.conf.cols,0);sbs[0]=this.getRowArray(this.conf.cols,0);for(var i=0;i<this.c;i++){sbl[0][i]=this.charBuf[this.r][i];sbs[0][i]=this.styleBuf[this.r][i];}},_sbType:function(text,style){var sb=this.scrollBuf;for(var i=0;i<text.length;i++){var ch=text.charCodeAt(i);if(!this.isPrintable(ch))ch=94;sb.lines[sb.r][sb.c]=ch;sb.styles[sb.r][sb.c++]=(style)?style:0;if(sb.c>=this.maxCols)this._sbNewLine();}},_sbNewLine:function(forced){var sb=this.scrollBuf;if(this.wrapping&&forced){sb.lines[sb.r][sb.c]=10;sb.lines[sb.r].length=sb.c+1;}
sb.r++;sb.c=0;sb.lines[sb.r]=this.getRowArray(this.conf.cols,0);sb.styles[sb.r]=this.getRowArray(this.conf.cols,0);},_sbWrap:function(){var wb=new Object();wb.lines=new Array();wb.styles=new Array();wb.lines[0]=this.getRowArray(this.conf.cols,0);wb.styles[0]=this.getRowArray(this.conf.cols,0);wb.r=0;wb.c=0;var sb=this.scrollBuf;var sbl=sb.lines;var sbs=sb.styles;var ch,st,wrap,lc,ls;var l=0;var lastR=0;var lastC=0;wb.cBreak=false;for(var r=0;r<sbl.length;r++){lc=sbl[r];ls=sbs[r];for(var c=0;c<lc.length;c++){ch=lc[c];st=ls[c];if(ch){var wrap=this.globals.wrapChars[ch];if(ch==10)wrap=1;if(wrap){if(wrap==2){l++;}
else if(wrap==4){l++;lc[c]=45;}
this._wbOut(wb,lastR,lastC,l);if(ch==10){this._wbIncLine(wb);}
else if((wrap==1)&&(wb.c<this.maxCols)){wb.lines[wb.r][wb.c]=ch;wb.styles[wb.r][wb.c++]=st;if(wb.c>=this.maxCols)this._wbIncLine(wb);}
if(wrap==3){lastR=r;lastC=c;l=1;}
else{l=0;lastR=r;lastC=c+1;if(lastC==lc.length){lastR++;lastC=0;}
if(wrap==4)wb.cBreak=true;}}
else{l++;}}
else continue;}}
if(l){if((wb.cbreak)&&(wb.c!=0))wb.c--;this._wbOut(wb,lastR,lastC,l);}
sb.lines=wb.lines;sb.styles=wb.styles;sb.r=wb.r;sb.c=wb.c;},_wbOut:function(wb,br,bc,l){var sb=this.scrollBuf;var sbl=sb.lines;var sbs=sb.styles;var ofs=0;var lc,ls;if(l+wb.c>this.maxCols){if(l<this.maxCols){this._wbIncLine(wb);}
else{var i0=0;ofs=this.maxCols-wb.c;lc=sbl[br];ls=sbs[br];while(true){for(var i=i0;i<ofs;i++){wb.lines[wb.r][wb.c]=lc[bc];wb.styles[wb.r][wb.c++]=ls[bc++];if(bc==sbl[br].length){bc=0;br++;lc=sbl[br];ls=sbs[br];}}
this._wbIncLine(wb);if(l-ofs<this.maxCols)break;i0=ofs;ofs+=this.maxCols;}}}
else if(wb.cBreak){wb.c--;}
lc=sbl[br];ls=sbs[br];for(var i=ofs;i<l;i++){wb.lines[wb.r][wb.c]=lc[bc];wb.styles[wb.r][wb.c++]=ls[bc++];if(bc==sbl[br].length){bc=0;br++;lc=sbl[br];ls=sbs[br];}}
wb.cBreak=false;},_wbIncLine:function(wb){wb.r++;wb.c=0;wb.lines[wb.r]=this.getRowArray(this.conf.cols,0);wb.styles[wb.r]=this.getRowArray(this.conf.cols,0);},_sbOut:function(){var sb=this.scrollBuf;if((this.wrapping)&&(!sb.status))this._sbWrap();var sbl=sb.lines;var sbs=sb.styles;var tcb=this.charBuf;var tsb=this.styleBuf;var ml=this.maxLines;var buflen=sbl.length;if(sb.more){if(sb.status){if(this.inputChar==this.globals.lcMoreKeyAbort){this.r=ml-1;this.c=0;tcb[this.r]=this.getRowArray(this.conf.cols,0);tsb[this.r]=this.getRowArray(this.conf.cols,0);this.redraw(this.r);this.handler=sb.handler;this.charMode=false;this.inputChar=0;this.scrollBuf=null;this.prompt();return;}
else if(this.inputChar==this.globals.lcMoreKeyContinue){this.clear();}
else{return;}}
else{if(this.r>=ml-1)this.clear();}}
if(this.r+buflen-sb.line<=ml){for(var i=sb.line;i<buflen;i++){var r=this.r+i-sb.line;tcb[r]=sbl[i];tsb[r]=sbs[i];this.redraw(r);}
this.r+=sb.r-sb.line;this.c=sb.c;if(sb.more){if(sb.status)this.handler=sb.handler;this.charMode=false;this.inputChar=0;this.scrollBuf=null;this.prompt();return;}}
else if(sb.more){ml--;if(sb.status==0){sb.handler=this.handler;this.handler=this._sbOut;this.charMode=true;sb.status=1;}
if(this.r){var ofs=ml-this.r;for(var i=sb.line;i<ofs;i++){var r=this.r+i-sb.line;tcb[r]=sbl[i];tsb[r]=sbs[i];this.redraw(r);}}
else{var ofs=sb.line+ml;for(var i=sb.line;i<ofs;i++){var r=this.r+i-sb.line;tcb[r]=sbl[i];tsb[r]=sbs[i];this.redraw(r);}}
sb.line=ofs;this.r=ml;this.c=0;this.type(this.globals.lcMorePrompt1,this.globals.lcMorePromtp1Style);this.type(this.globals.lcMorePrompt2,this.globals.lcMorePrompt2Style);this.lock=false;return;}
else if(buflen>=ml){var ofs=buflen-ml;for(var i=0;i<ml;i++){var r=ofs+i;tcb[i]=sbl[r];tsb[i]=sbs[r];this.redraw(i);}
this.r=ml-1;this.c=sb.c;}
else{var dr=ml-buflen;var ofs=this.r-dr;for(var i=0;i<dr;i++){var r=ofs+i;for(var c=0;c<this.maxCols;c++){tcb[i][c]=tcb[r][c];tsb[i][c]=tsb[r][c];}
this.redraw(i);}
for(var i=0;i<buflen;i++){var r=dr+i;tcb[r]=sbl[i];tsb[r]=sbs[i];this.redraw(r);}
this.r=ml-1;this.c=sb.c;}
this.scrollBuf=null;},typeAt:function(r,c,text,style){var tr1=this.r;var tc1=this.c;this.cursorSet(r,c);for(var i=0;i<text.length;i++){var ch=text.charCodeAt(i);if(!this.isPrintable(ch))ch=94;this.charBuf[this.r][this.c]=ch;this.styleBuf[this.r][this.c]=(style)?style:0;var last_r=this.r;this._incCol();if(this.r!=last_r)this.redraw(last_r);}
this.redraw(this.r);this.r=tr1;this.c=tc1;},statusLine:function(text,style,offset){var ch,r;style=((style)&&(!isNaN(style)))?parseInt(style)&15:0;if((offset)&&(offset>0))r=this.conf.rows-offset
else r=this.conf.rows-1;for(var i=0;i<this.conf.cols;i++){if(i<text.length){ch=text.charCodeAt(i);if(!this.isPrintable(ch))ch=94;}
else ch=0;this.charBuf[r][i]=ch;this.styleBuf[r][i]=style;}
this.redraw(r);},printRowFromString:function(r,text,style){var ch;style=((style)&&(!isNaN(style)))?parseInt(style)&15:0;if((r>=0)&&(r<this.maxLines)){if(typeof text!='string')text=''+text;for(var i=0;i<this.conf.cols;i++){if(i<text.length){ch=text.charCodeAt(i);if(!this.isPrintable(ch))ch=94;}
else ch=0;this.charBuf[r][i]=ch;this.styleBuf[r][i]=style;}
this.redraw(r);}},setChar:function(ch,r,c,style){this.charBuf[r][c]=ch;this.styleBuf[this.r][this.c]=(style)?style:0;this.redraw(r);},newLine:function(){this.c=0;this._incRow();},_charOut:function(ch,style){this.charBuf[this.r][this.c]=ch;this.styleBuf[this.r][this.c]=(style)?style:0;this.redraw(this.r);this._incCol();},_incCol:function(){this.c++;if(this.c>=this.maxCols){this.c=0;this._incRow();}},_incRow:function(){this.r++;if(this.r>=this.maxLines){this._scrollLines(0,this.maxLines);this.r=this.maxLines-1;}},_scrollLines:function(start,end){window.status='Scrolling lines ...';start++;for(var ri=start;ri<end;ri++){var rt=ri-1;this.charBuf[rt]=this.charBuf[ri];this.styleBuf[rt]=this.styleBuf[ri];}
var rt=end-1;this.charBuf[rt]=this.getRowArray(this.conf.cols,0);this.styleBuf[rt]=this.getRowArray(this.conf.cols,0);this.redraw(rt);for(var r=end-1;r>=start;r--)this.redraw(r-1);window.status='';},clear:function(){window.status='Clearing display ...';this.cursorOff();this.insert=false;for(var ri=0;ri<this.maxLines;ri++){this.charBuf[ri]=this.getRowArray(this.conf.cols,0);this.styleBuf[ri]=this.getRowArray(this.conf.cols,0);this.redraw(ri);}
this.r=0;this.c=0;window.status='';},reset:function(){if(this.lock)return;this.lock=true;this.rawMode=false;this.charMode=false;this.maxLines=this.conf.rows;this.maxCols=this.conf.cols;this.lastLine='';this.lineBuffer='';this.inputChar=0;this.clear();},prompt:function(){this.lock=true;if(this.c>0)this.newLine();this.type(this.ps);this._charOut(1);this.lock=false;this.cursorOn();},isPrintable:function(ch,unicodePage1only){if((this.wrapping)&&(this.globals.wrapChars[ch]==4))return true;if((unicodePage1only)&&(ch>255)){return((ch==this.termKey.EURO)&&(this.printEuro))?true:false;}
return(((ch>=32)&&(ch!=this.termKey.DEL))||((this.printTab)&&(ch==this.termKey.TAB)));},cursorSet:function(r,c){var crsron=this.cursoractive;if(crsron)this.cursorOff();this.r=r%this.maxLines;this.c=c%this.maxCols;this._cursorReset(crsron);},cursorOn:function(){if(this.blinkTimer)clearTimeout(this.blinkTimer);this.blinkBuffer=this.styleBuf[this.r][this.c];this._cursorBlink();this.cursoractive=true;},cursorOff:function(){if(this.blinkTimer)clearTimeout(this.blinkTimer);if(this.cursoractive){this.styleBuf[this.r][this.c]=this.blinkBuffer;this.redraw(this.r);this.cursoractive=false;}},cursorLeft:function(){var crsron=this.cursoractive;if(crsron)this.cursorOff();var r=this.r;var c=this.c;if(c>0)c--
else if(r>0){c=this.maxCols-1;r--;}
if(this.isPrintable(this.charBuf[r][c])){this.r=r;this.c=c;}
this.insert=true;this._cursorReset(crsron);},cursorRight:function(){var crsron=this.cursoractive;if(crsron)this.cursorOff();var r=this.r;var c=this.c;if(c<this.maxCols-1)c++
else if(r<this.maxLines-1){c=0;r++;}
if(!this.isPrintable(this.charBuf[r][c])){this.insert=false;}
if(this.isPrintable(this.charBuf[this.r][this.c])){this.r=r;this.c=c;}
this._cursorReset(crsron);},backspace:function(){var crsron=this.cursoractive;if(crsron)this.cursorOff();var r=this.r;var c=this.c;if(c>0)c--
else if(r>0){c=this.maxCols-1;r--;};if(this.isPrintable(this.charBuf[r][c])){this._scrollLeft(r,c);this.r=r;this.c=c;};this._cursorReset(crsron);},fwdDelete:function(){var crsron=this.cursoractive;if(crsron)this.cursorOff();if(this.isPrintable(this.charBuf[this.r][this.c])){this._scrollLeft(this.r,this.c);if(!this.isPrintable(this.charBuf[this.r][this.c]))this.insert=false;}
this._cursorReset(crsron);},_cursorReset:function(crsron){if(crsron)this.cursorOn()
else{this.blinkBuffer=this.styleBuf[this.r][this.c];}},_cursorBlink:function(){if(this.blinkTimer)clearTimeout(this.blinkTimer);if(this==this.globals.activeTerm){if(this.crsrBlockMode){this.styleBuf[this.r][this.c]=(this.styleBuf[this.r][this.c]&1)?this.styleBuf[this.r][this.c]&254:this.styleBuf[this.r][this.c]|1;}
else{this.styleBuf[this.r][this.c]=(this.styleBuf[this.r][this.c]&2)?this.styleBuf[this.r][this.c]&253:this.styleBuf[this.r][this.c]|2;}
this.redraw(this.r);}
if(this.crsrBlinkMode)this.blinkTimer=setTimeout('Terminal.prototype.globals.activeTerm._cursorBlink()',this.blinkDelay);},_scrollLeft:function(r,c){var rows=new Array();rows[0]=r;while(this.isPrintable(this.charBuf[r][c])){var ri=r;var ci=c+1;if(ci==this.maxCols){if(ri<this.maxLines-1){ci=0;ri++;rows[rows.length]=ri;}
else{break;}}
this.charBuf[r][c]=this.charBuf[ri][ci];this.styleBuf[r][c]=this.styleBuf[ri][ci];c=ci;r=ri;}
if(this.charBuf[r][c]!=0)this.charBuf[r][c]=0;for(var i=0;i<rows.length;i++)this.redraw(rows[i]);},_scrollRight:function(r,c){var rows=new Array();var end=this._getLineEnd(r,c);var ri=end[0];var ci=end[1];if((ci==this.maxCols-1)&&(ri==this.maxLines-1)){if(r==0)return;this._scrollLines(0,this.maxLines);this.r--;r--;ri--;}
rows[r]=1;while(this.isPrintable(this.charBuf[ri][ci])){var rt=ri;var ct=ci+1;if(ct==this.maxCols){ct=0;rt++;rows[rt]=1;}
this.charBuf[rt][ct]=this.charBuf[ri][ci];this.styleBuf[rt][ct]=this.styleBuf[ri][ci];if((ri==r)&&(ci==c))break;ci--;if(ci<0){ci=this.maxCols-1;ri--;rows[ri]=1;}}
for(var i=r;i<this.maxLines;i++){if(rows[i])this.redraw(i);}},_getLineEnd:function(r,c){if(!this.isPrintable(this.charBuf[r][c])){c--;if(c<0){if(r>0){r--;c=this.maxCols-1;}
else{c=0;}}}
if(this.isPrintable(this.charBuf[r][c])){while(true){var ri=r;var ci=c+1;if(ci==this.maxCols){if(ri<this.maxLines-1){ri++;ci=0;}
else{break;}}
if(!this.isPrintable(this.charBuf[ri][ci]))break;c=ci;r=ri;}}
return[r,c];},_getLineStart:function(r,c){var ci,ri;if(!this.isPrintable(this.charBuf[r][c])){ci=c-1;ri=r;if(ci<0){if(ri==0)return[0,0];ci=this.maxCols-1;ri--;}
if(!this.isPrintable(this.charBuf[ri][ci]))return[r,c]
else{r=ri;c=ci;}}
while(true){var ri=r;var ci=c-1;if(ci<0){if(ri==0)break;ci=this.maxCols-1;ri--;}
if(!this.isPrintable(this.charBuf[ri][ci]))break;;r=ri;c=ci;}
return[r,c];},_getLine:function(){var end=this._getLineEnd(this.r,this.c);var r=end[0];var c=end[1];var line=new Array();while(this.isPrintable(this.charBuf[r][c])){line[line.length]=String.fromCharCode(this.charBuf[r][c]);if(c>0)c--
else if(r>0){c=this.maxCols-1;r--;}
else break;}
line.reverse();return line.join('');},_clearLine:function(){var end=this._getLineEnd(this.r,this.c);var r=end[0];var c=end[1];var line='';while(this.isPrintable(this.charBuf[r][c])){this.charBuf[r][c]=0;if(c>0){c--;}
else if(r>0){this.redraw(r);c=this.maxCols-1;r--;}
else break;}
if(r!=end[0])this.redraw(r);c++;this.cursorSet(r,c);this.insert=false;},focus:function(){this.globals.setFocus(this);},termKey:null,_makeTerm:function(rebuild){window.status='Building terminal ...';this.globals.hasLayers=(document.layers)?true:false;this.globals.hasSubDivs=(navigator.userAgent.indexOf('Gecko')<0);var divPrefix=this.termDiv+'_r';var s='';s+='<table border="0" cellspacing="0" cellpadding="'+this.conf.frameWidth+'">\n';s+='<tr><td bgcolor="'+this.conf.frameColor+'"><table border="0" cellspacing="0" cellpadding="2"><tr><td  bgcolor="'+this.conf.bgColor+'"><table border="0" cellspacing="0" cellpadding="0">\n';var rstr='';for(var c=0;c<this.conf.cols;c++)rstr+='&nbsp;';for(var r=0;r<this.conf.rows;r++){var termid=((this.globals.hasLayers)||(this.globals.hasSubDivs))?'':' id="'+divPrefix+r+'"';s+='<tr><td nowrap height="'+this.conf.rowHeight+'"'+termid+' class="'+this.conf.fontClass+'">'+rstr+'<\/td><\/tr>\n';}
s+='<\/table><\/td><\/tr>\n';s+='<\/table><\/td><\/tr>\n';s+='<\/table>\n';var termOffset=2+this.conf.frameWidth;if(this.globals.hasLayers){for(var r=0;r<this.conf.rows;r++){s+='<layer name="'+divPrefix+r+'" top="'+(termOffset+r*this.conf.rowHeight)+'" left="'+termOffset+'" class="'+this.conf.fontClass+'"><\/layer>\n';}
this.ns4ParentDoc=document.layers[this.termDiv].document;this.globals.termStringStart='<table border="0" cellspacing="0" cellpadding="0"><tr><td nowrap height="'+this.conf.rowHeight+'" class="'+this.conf.fontClass+'">';this.globals.termStringEnd='<\/td><\/tr><\/table>';}
else if(this.globals.hasSubDivs){for(var r=0;r<this.conf.rows;r++){s+='<div id="'+divPrefix+r+'" style="position:absolute; top:'+(termOffset+r*this.conf.rowHeight)+'px; left: '+termOffset+'px;" class="'+this.conf.fontClass+'"><\/div>\n';}
this.globals.termStringStart='<table border="0" cellspacing="0" cellpadding="0"><tr><td nowrap height="'+this.conf.rowHeight+'" class="'+this.conf.fontClass+'">';this.globals.termStringEnd='<\/td><\/tr><\/table>';}
this.globals.writeElement(this.termDiv,s);if(!rebuild){this.globals.setElementXY(this.termDiv,this.conf.x,this.conf.y);this.globals.setVisible(this.termDiv,1);}
window.status='';},rebuild:function(){var rl=this.conf.rows;var cl=this.conf.cols;for(var r=0;r<rl;r++){var cbr=this.charBuf[r];if(!cbr){this.charBuf[r]=this.getRowArray(cl,0);this.styleBuf[r]=this.getRowArray(cl,0);}
else if(cbr.length<cl){for(var c=cbr.length;c<cl;c++){this.charBuf[r][c]=0;this.styleBuf[r][c]=0;}}}
var resetcrsr=false;if(this.r>=rl){r=rl-1;resetcrsr=true;}
if(this.c>=cl){c=cl-1;resetcrsr=true;}
if((resetcrsr)&&(this.cursoractive))this.cursorOn();this._makeTerm(true);for(var r=0;r<rl;r++){this.redraw(r);}},moveTo:function(x,y){this.globals.setElementXY(this.termDiv,x,y);},resizeTo:function(x,y){if(this.termDivReady()){x=parseInt(x,10);y=parseInt(y,10);if((isNaN(x))||(isNaN(y))||(x<4)||(y<2))return false;this.maxCols=this.conf.cols=x;this.maxLines=this.conf.rows=y;this._makeTerm();this.clear();return true;}
else return false;},redraw:function(r){var s=this.globals.termStringStart;var curStyle=0;var tstls=this.globals.termStyles;var tscls=this.globals.termStyleClose;var tsopn=this.globals.termStyleOpen;var tspcl=this.globals.termSpecials;var tclrs=this.globals.colorCodes;var tnclrs=this.globals.nsColorCodes;var twclrs=this.globals.webColorCodes;var t_cb=this.charBuf;var t_sb=this.styleBuf;var clr;for(var i=0;i<this.conf.cols;i++){var c=t_cb[r][i];var cs=t_sb[r][i];if(cs!=curStyle){if(curStyle){if(curStyle&0xffff00)s+='</span>';for(var k=tstls.length-1;k>=0;k--){var st=tstls[k];if(curStyle&st)s+=tscls[st];}}
curStyle=cs;for(var k=0;k<tstls.length;k++){var st=tstls[k];if(curStyle&st)s+=tsopn[st];}
clr='';if(curStyle&0xff00){var cc=(curStyle&0xff00)>>>8;clr=(cc<16)?tclrs[cc]:'#'+tnclrs[cc-16];}
else if(curStyle&0xff0000){clr='#'+twclrs[(curStyle&0xff0000)>>>16];}
if(clr){if(curStyle&1){s+='<span style="background-color:'+clr+' !important;">';}
else{s+='<span style="color:'+clr+' !important;">';}}}
s+=(tspcl[c])?tspcl[c]:String.fromCharCode(c);}
if(curStyle>0){if(curStyle&0xffff00)s+='</span>';for(var k=tstls.length-1;k>=0;k--){var st=tstls[k];if(curStyle&st)s+=tscls[st];}}
s+=this.globals.termStringEnd;this.globals.writeElement(this.termDiv+'_r'+r,s,this.ns4ParentDoc);},guiReady:function(){ready=true;if(this.globals.guiElementsReady(this.termDiv,window.document)){for(var r=0;r<this.conf.rows;r++){if(this.globals.guiElementsReady(this.termDiv+'_r'+r,this.ns4ParentDoc)==false){ready=false;break;}}}
else ready=false;return ready;},termDivReady:function(){if(document.layers){return(document.layers[this.termDiv])?true:false;}
else if(document.getElementById){return(document.getElementById(this.termDiv))?true:false;}
else if(document.all){return(document.all[this.termDiv])?true:false;}
else{return false;}},getDimensions:function(){var w=0;var h=0;var d=this.termDiv;if(document.layers){if(document.layers[d]){w=document.layers[d].clip.right;h=document.layers[d].clip.bottom;}}
else if(document.getElementById){var obj=document.getElementById(d);if((obj)&&(obj.firstChild)){w=parseInt(obj.firstChild.offsetWidth,10);h=parseInt(obj.firstChild.offsetHeight,10);}
else if((obj)&&(obj.children)&&(obj.children[0])){w=parseInt(obj.children[0].offsetWidth,10);h=parseInt(obj.children[0].offsetHeight,10);}}
else if(document.all){var obj=document.all[d];if((obj)&&(obj.children)&&(obj.children[0])){w=parseInt(obj.children[0].offsetWidth,10);h=parseInt(obj.children[0].offsetHeight,10);}}
return{width:w,height:h};},globals:{termToInitialze:null,activeTerm:null,kbdEnabled:false,keylock:false,keyRepeatDelay1:450,keyRepeatDelay2:100,keyRepeatTimer:null,lcMorePrompt1:' -- MORE -- ',lcMorePromtp1Style:1,lcMorePrompt2:' (Type: space to continue, \'q\' to quit)',lcMorePrompt2Style:0,lcMoreKeyAbort:113,lcMoreKeyContinue:32,_initGlobals:function(){var tg=Terminal.prototype.globals;tg._extendMissingStringMethods();tg._initWebColors();tg._initDomKeyRef();Terminal.prototype.termKey=tg.termKey;},getHexChar:function(c){var tg=Terminal.prototype.globals;if(tg.isHexChar(c))return tg.hexToNum[c];return-1;},isHexChar:function(c){return(((c>='0')&&(c<='9'))||((c>='a')&&(c<='f'))||((c>='A')&&(c<='F')))?true:false;},isHexOnlyChar:function(c){return(((c>='a')&&(c<='f'))||((c>='A')&&(c<='F')))?true:false;},hexToNum:{'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'a':10,'b':11,'c':12,'d':13,'e':14,'f':15,'A':10,'B':11,'C':12,'D':13,'E':14,'F':15},webColors:[],webColorCodes:[''],colors:{black:1,red:2,green:3,yellow:4,blue:5,magenta:6,cyan:7,white:8,grey:9,red2:10,green2:11,yellow2:12,blue2:13,magenta2:14,cyan2:15,red1:2,green1:3,yellow1:4,blue1:5,magenta1:6,cyan1:7,gray:9,darkred:10,darkgreen:11,darkyellow:12,darkblue:13,darkmagenta:14,darkcyan:15,'default':0,clear:0},colorCodes:['','#000000','#ff0000','#00ff00','#ffff00','#0066ff','#ff00ff','#00ffff','#ffffff','#808080','#990000','#009900','#999900','#003399','#990099','#009999'],nsColors:{'aliceblue':1,'antiquewhite':2,'aqua':3,'aquamarine':4,'azure':5,'beige':6,'black':7,'blue':8,'blueviolet':9,'brown':10,'burlywood':11,'cadetblue':12,'chartreuse':13,'chocolate':14,'coral':15,'cornflowerblue':16,'cornsilk':17,'crimson':18,'darkblue':19,'darkcyan':20,'darkgoldenrod':21,'darkgray':22,'darkgreen':23,'darkkhaki':24,'darkmagenta':25,'darkolivegreen':26,'darkorange':27,'darkorchid':28,'darkred':29,'darksalmon':30,'darkseagreen':31,'darkslateblue':32,'darkslategray':33,'darkturquoise':34,'darkviolet':35,'deeppink':36,'deepskyblue':37,'dimgray':38,'dodgerblue':39,'firebrick':40,'floralwhite':41,'forestgreen':42,'fuchsia':43,'gainsboro':44,'ghostwhite':45,'gold':46,'goldenrod':47,'gray':48,'green':49,'greenyellow':50,'honeydew':51,'hotpink':52,'indianred':53,'indigo':54,'ivory':55,'khaki':56,'lavender':57,'lavenderblush':58,'lawngreen':59,'lemonchiffon':60,'lightblue':61,'lightcoral':62,'lightcyan':63,'lightgoldenrodyellow':64,'lightgreen':65,'lightgrey':66,'lightpink':67,'lightsalmon':68,'lightseagreen':69,'lightskyblue':70,'lightslategray':71,'lightsteelblue':72,'lightyellow':73,'lime':74,'limegreen':75,'linen':76,'maroon':77,'mediumaquamarine':78,'mediumblue':79,'mediumorchid':80,'mediumpurple':81,'mediumseagreen':82,'mediumslateblue':83,'mediumspringgreen':84,'mediumturquoise':85,'mediumvioletred':86,'midnightblue':87,'mintcream':88,'mistyrose':89,'moccasin':90,'navajowhite':91,'navy':92,'oldlace':93,'olive':94,'olivedrab':95,'orange':96,'orangered':97,'orchid':98,'palegoldenrod':99,'palegreen':100,'paleturquoise':101,'palevioletred':102,'papayawhip':103,'peachpuff':104,'peru':105,'pink':106,'plum':107,'powderblue':108,'purple':109,'red':110,'rosybrown':111,'royalblue':112,'saddlebrown':113,'salmon':114,'sandybrown':115,'seagreen':116,'seashell':117,'sienna':118,'silver':119,'skyblue':120,'slateblue':121,'slategray':122,'snow':123,'springgreen':124,'steelblue':125,'tan':126,'teal':127,'thistle':128,'tomato':129,'turquoise':130,'violet':131,'wheat':132,'white':133,'whitesmoke':134,'yellow':135,'yellowgreen':136},nsColorCodes:['','f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','000000','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00008b','008b8b','b8860b','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','90ee90','d3d3d3','ffb6c1','ffa07a','20b2aa','87cefa','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32'],_webSwatchChars:['0','3','6','9','c','f'],_initWebColors:function(){var tg=Terminal.prototype.globals;var ws=tg._webColorSwatch;var wn=tg.webColors;var cc=tg.webColorCodes;var n=1;var a,b,c,al,bl,bs,cl;for(var i=0;i<6;i++){a=tg._webSwatchChars[i];al=a+a;for(var j=0;j<6;j++){b=tg._webSwatchChars[j];bl=al+b+b;bs=a+b;for(var k=0;k<6;k++){c=tg._webSwatchChars[k];cl=bl+c+c;wn[bs+c]=wn[cl]=n;cc[n]=cl;n++;}}}},webifyColor:function(s){var tg=Terminal.prototype.globals;if(s.length==6){var c='';for(var i=0;i<6;i+=2){var a=s.charAt(i);var b=s.charAt(i+1);if((tg.isHexChar(a))&&(tg.isHexChar(b))){c+=tg._webSwatchChars[Math.round(parseInt(a+b,16)/255*5)];}
else{return'';}}
return c;}
else if(s.length==3){var c='';for(var i=0;i<3;i++){var a=s.charAt(i);if(tg.isHexChar(a)){c+=tg._webSwatchChars[Math.round(parseInt(a,16)/15*5)];}
else{return'';}}
return c;}
else return'';},setColor:function(label,value){var tg=Terminal.prototype.globals;if((typeof label=='number')&&(label>=1)&&(label<=15)){tg.colorCodes[label]=value;}
else if(typeof label=='string'){label=label.toLowerCase();if((label.length==1)&&(tg.isHexChar(label))){var n=tg.hexToNum[label];if(n)tg.colorCodes[n]=value;}
else if(typeof tg.colors[label]!='undefined'){var n=tg.colors[label];if(n)tg.colorCodes[n]=value;}}},getColorString:function(label){var tg=Terminal.prototype.globals;if((typeof label=='number')&&(label>=0)&&(label<=15)){return tg.colorCodes[label];}
else if(typeof label=='string'){label=label.toLowerCase();if((label.length==1)&&(tg.isHexChar(label))){return tg.colorCodes[tg.hexToNum[label]];}
else if((typeof tg.colors[label]!='undefined')){return tg.colorCodes[tg.colors[label]];}}
return'';},getColorCode:function(label){var tg=Terminal.prototype.globals;if((typeof label=='number')&&(label>=0)&&(label<=15)){return label;}
else if(typeof label=='string'){label=label.toLowerCase();if((label.length==1)&&(tg.isHexChar(label))){return parseInt(label,16);}
else if((typeof tg.colors[label]!='undefined')){return tg.colors[label];}}
return 0;},insertText:function(text){var tg=Terminal.prototype.globals;var termRef=tg.activeTerm;if((!termRef)||(termRef.closed)||(tg.keylock)||(termRef.lock)||(termRef.charMode))return false;for(var i=0;i<text.length;i++){tg.keyHandler({which:text.charCodeAt(i),_remapped:true});}
return true;},importEachLine:function(text){var tg=Terminal.prototype.globals;var termRef=tg.activeTerm;if((!termRef)||(termRef.closed)||(tg.keylock)||(termRef.lock)||(termRef.charMode))return false;termRef.cursorOff();termRef._clearLine();text=text.replace(/\r\n?/g,'\n');var t=text.split('\n');for(var i=0;i<t.length;i++){for(var k=0;k<t[i].length;k++){tg.keyHandler({which:t[i].charCodeAt(k),_remapped:true});}
tg.keyHandler({which:term.termKey.CR,_remapped:true});}
return true;},importMultiLine:function(text){var tg=Terminal.prototype.globals;var termRef=tg.activeTerm;if((!termRef)||(termRef.closed)||(tg.keylock)||(termRef.lock)||(termRef.charMode))return false;termRef.lock=true;termRef.cursorOff();termRef._clearLine();text=text.replace(/\r\n?/g,'\n');var lines=text.split('\n');for(var i=0;i<lines.length;i++){termRef.type(lines[i]);if(i<lines.length-1)termRef.newLine();}
termRef.lineBuffer=text;termRef.lastLine='';termRef.inputChar=0;termRef.handler();return true;},normalize:function(n,m){var s=''+n;while(s.length<m)s='0'+s;return s;},fillLeft:function(t,n){if(typeof t!='string')t=''+t;while(t.length<n)t=' '+t;return t;},center:function(t,l){var s='';for(var i=t.length;i<l;i+=2)s+=' ';return s+t;},stringReplace:function(s1,s2,t){var l1=s1.length;var l2=s2.length;var ofs=t.indexOf(s1);while(ofs>=0){t=t.substring(0,ofs)+s2+t.substring(ofs+l1);ofs=t.indexOf(s1,ofs+l2);}
return t;},wrapChars:{9:1,10:1,12:4,13:1,32:1,40:3,45:2,61:2,91:3,94:3,123:3},setFocus:function(termref){Terminal.prototype.globals.activeTerm=termref;Terminal.prototype.globals.clearRepeatTimer();},termKey:{'NUL':0x00,'SOH':0x01,'STX':0x02,'ETX':0x03,'EOT':0x04,'ENQ':0x05,'ACK':0x06,'BEL':0x07,'BS':0x08,'BACKSPACE':0x08,'HT':0x09,'TAB':0x09,'LF':0x0A,'VT':0x0B,'FF':0x0C,'CR':0x0D,'SO':0x0E,'SI':0x0F,'DLE':0x10,'DC1':0x11,'DC2':0x12,'DC3':0x13,'DC4':0x14,'NAK':0x15,'SYN':0x16,'ETB':0x17,'CAN':0x18,'EM':0x19,'SUB':0x1A,'ESC':0x1B,'IS4':0x1C,'IS3':0x1D,'IS2':0x1E,'IS1':0x1F,'DEL':0x7F,'EURO':0x20AC,'LEFT':0x1C,'RIGHT':0x1D,'UP':0x1E,'DOWN':0x1F},termDomKeyRef:{},_domKeyMappingData:{'LEFT':'LEFT','RIGHT':'RIGHT','UP':'UP','DOWN':'DOWN','BACK_SPACE':'BS','RETURN':'CR','ENTER':'CR','ESCAPE':'ESC','DELETE':'DEL','TAB':'TAB'},_initDomKeyRef:function(){var tg=Terminal.prototype.globals;var m=tg._domKeyMappingData;var r=tg.termDomKeyRef;var k=tg.termKey;for(var i in m)r['DOM_VK_'+i]=k[m[i]];},registerEvent:function(obj,eventType,handler,capture){if(obj.addEventListener){obj.addEventListener(eventType.toLowerCase(),handler,capture);}
else{var et=eventType.toUpperCase();if((window.Event)&&(window.Event[et])&&(obj.captureEvents))obj.captureEvents(Event[et]);obj['on'+eventType.toLowerCase()]=handler;}},releaseEvent:function(obj,eventType,handler,capture){if(obj.removeEventListener){obj.removeEventListener(eventType.toLowerCase(),handler,capture);}
else{var et=eventType.toUpperCase();if((window.Event)&&(window.Event[et])&&(obj.releaseEvents))obj.releaseEvents(Event[et]);et='on'+eventType.toLowerCase();if((obj[et])&&(obj[et]==handler))obj.et=null;}},enableKeyboard:function(term){var tg=Terminal.prototype.globals;if(!tg.kbdEnabled){tg.registerEvent(document,'keypress',tg.keyHandler,true);tg.registerEvent(document,'keydown',tg.keyFix,true);tg.registerEvent(document,'keyup',tg.clearRepeatTimer,true);tg.kbdEnabled=true;}
tg.activeTerm=term;},disableKeyboard:function(term){var tg=Terminal.prototype.globals;if(tg.kbdEnabled){tg.releaseEvent(document,'keypress',tg.keyHandler,true);tg.releaseEvent(document,'keydown',tg.keyFix,true);tg.releaseEvent(document,'keyup',tg.clearRepeatTimer,true);tg.kbdEnabled=false;}
tg.activeTerm=null;},keyFix:function(e){var tg=Terminal.prototype.globals;var term=tg.activeTerm;if((tg.keylock)||(term.lock))return true;if(window.event){var ch=window.event.keyCode;if(!e)e=window.event;if(e.DOM_VK_UP){for(var i in tg.termDomKeyRef){if((e[i])&&(ch==e[i])){tg.keyHandler({which:tg.termDomKeyRef[i],_remapped:true,_repeat:(ch==0x1B)?true:false});if(e.preventDefault)e.preventDefault();if(e.stopPropagation)e.stopPropagation();e.cancleBubble=true;return false;}}
e.cancleBubble=false;return true;}
else{var termKey=term.termKey;var keyHandler=tg.keyHandler;if((ch==8)&&(!term.isSafari))keyHandler({which:termKey.BS,_remapped:true,_repeat:true});else if(ch==9)keyHandler({which:termKey.TAB,_remapped:true,_repeat:true});else if(ch==37)keyHandler({which:termKey.LEFT,_remapped:true,_repeat:true});else if(ch==39)keyHandler({which:termKey.RIGHT,_remapped:true,_repeat:true});else if(ch==38)keyHandler({which:termKey.UP,_remapped:true,_repeat:true});else if(ch==40)keyHandler({which:termKey.DOWN,_remapped:true,_repeat:true});else if(ch==127)keyHandler({which:termKey.DEL,_remapped:true,_repeat:true});else if((ch>=57373)&&(ch<=57376)){if(ch==57373)keyHandler({which:termKey.UP,_remapped:true,_repeat:true});else if(ch==57374)keyHandler({which:termKey.DOWN,_remapped:true,_repeat:true});else if(ch==57375)keyHandler({which:termKey.LEFT,_remapped:true,_repeat:true});else if(ch==57376)keyHandler({which:termKey.RIGHT,_remapped:true,_repeat:true});}
else{e.cancleBubble=false;return true;}
if(e.preventDefault)e.preventDefault();if(e.stopPropagation)e.stopPropagation();e.cancleBubble=true;return false;}}},clearRepeatTimer:function(e){var tg=Terminal.prototype.globals;if(tg.keyRepeatTimer){clearTimeout(tg.keyRepeatTimer);tg.keyRepeatTimer=null;}},doKeyRepeat:function(ch){Terminal.prototype.globals.keyHandler({which:ch,_remapped:true,_repeated:true})},keyHandler:function(e){var tg=Terminal.prototype.globals;var term=tg.activeTerm;if((tg.keylock)||(term.lock))return true;if((window.event)&&(window.event.preventDefault))window.event.preventDefault()
else if((e)&&(e.preventDefault))e.preventDefault();if((window.event)&&(window.event.stopPropagation))window.event.stopPropagation()
else if((e)&&(e.stopPropagation))e.stopPropagation();var ch;var ctrl=false;var shft=false;var remapped=false;var termKey=term.termKey;var keyRepeat=0;if(e){ch=e.which;ctrl=(((e.ctrlKey)&&(e.altKey))||(e.modifiers==2));shft=((e.shiftKey)||(e.modifiers==4));if(e._remapped){remapped=true;if(window.event){ctrl=((ctrl)||((window.event.ctrlKey)&&(!window.event.altKey)));shft=((shft)||(window.event.shiftKey));}}
if(e._repeated){keyRepeat=2;}
else if(e._repeat){keyRepeat=1;}}
else if(window.event){ch=window.event.keyCode;ctrl=((window.event.ctrlKey)&&(!window.event.altKey));shft=(window.event.shiftKey);if(window.event._repeated){keyRepeat=2;}
else if(window.event._repeat){keyRepeat=1;}}
else{return true;}
if((ch=='')&&(remapped==false)){if(e==null)e=window.event;if((e.charCode==0)&&(e.keyCode)){if(e.DOM_VK_UP){var dkr=tg.termDomKeyRef;for(var i in dkr){if((e[i])&&(e.keyCode==e[i])){ch=dkr[i];break;}}}
else{if(e.keyCode==28)ch=termKey.LEFT;else if(e.keyCode==29)ch=termKey.RIGHT;else if(e.keyCode==30)ch=termKey.UP;else if(e.keyCode==31)ch=termKey.DOWN;else if(e.keyCode==37)ch=termKey.LEFT;else if(e.keyCode==39)ch=termKey.RIGHT;else if(e.keyCode==38)ch=termKey.UP;else if(e.keyCode==40)ch=termKey.DOWN;else if(e.keyCode==9)ch=termKey.TAB;;}}}
if((ch>=0xE000)&&(ch<=0xF8FF))return;if(keyRepeat){tg.clearRepeatTimer();tg.keyRepeatTimer=window.setTimeout('Terminal.prototype.globals.doKeyRepeat('+ch+')',(keyRepeat==1)?tg.keyRepeatDelay1:tg.keyRepeatDelay2);}
if(term.charMode){term.insert=false;term.inputChar=ch;term.lineBuffer='';term.handler();if((ch<=32)&&(window.event))window.event.cancleBubble=true;return false;}
if(!ctrl){if(ch==termKey.CR){term.lock=true;term.cursorOff();term.insert=false;if(term.rawMode){term.lineBuffer=term.lastLine;}
else{term.lineBuffer=term._getLine();if((term.lineBuffer!='')&&((!term.historyUnique)||(term.history.length==0)||(term.lineBuffer!=term.history[term.history.length-1]))){term.history[term.history.length]=term.lineBuffer;}
term.histPtr=term.history.length;}
term.lastLine='';term.inputChar=0;term.handler();if(window.event)window.event.cancleBubble=true;return false;}
else if(ch==termKey.ESC){if(term.conf.closeOnESC)term.close();if(window.event)window.event.cancleBubble=true;return false;}
if((ch<32)&&(term.rawMode)){if(window.event)window.event.cancleBubble=true;return false;}
else{if(ch==termKey.LEFT){term.cursorLeft();if(window.event)window.event.cancleBubble=true;return false;}
else if(ch==termKey.RIGHT){term.cursorRight();if(window.event)window.event.cancleBubble=true;return false;}
else if(ch==termKey.UP){term.cursorOff();if(term.histPtr==term.history.length)term.lastLine=term._getLine();term._clearLine();if((term.history.length)&&(term.histPtr>=0)){if(term.histPtr>0)term.histPtr--;term.type(term.history[term.histPtr]);}
else if(term.lastLine)term.type(term.lastLine);term.cursorOn();if(window.event)window.event.cancleBubble=true;return false;}
else if(ch==termKey.DOWN){term.cursorOff();if(term.histPtr==term.history.length)term.lastLine=term._getLine();term._clearLine();if((term.history.length)&&(term.histPtr<=term.history.length)){if(term.histPtr<term.history.length)term.histPtr++;if(term.histPtr<term.history.length)term.type(term.history[term.histPtr])
else if(term.lastLine)term.type(term.lastLine);}
else if(term.lastLine)term.type(term.lastLine);term.cursorOn();if(window.event)window.event.cancleBubble=true;return false;}
else if(ch==termKey.BS){term.backspace();if(window.event)window.event.cancleBubble=true;return false;}
else if(ch==termKey.DEL){if(term.DELisBS)term.backspace()
else term.fwdDelete();if(window.event)window.event.cancleBubble=true;return false;}}}
if(term.rawMode){if(term.isPrintable(ch)){term.lastLine+=String.fromCharCode(ch);}
if((ch==32)&&(window.event))window.event.cancleBubble=true
else if((window.opera)&&(window.event))window.event.cancleBubble=true;return false;}
else{if((term.conf.catchCtrlH)&&((ch==termKey.BS)||((ctrl)&&(ch==72)))){term.backspace();if(window.event)window.event.cancleBubble=true;return false;}
else if((term.ctrlHandler)&&((ch<32)||((ctrl)&&(term.isPrintable(ch,true))))){if(((ch>=65)&&(ch<=96))||(ch==63)){if(ch==63)ch=31
else ch-=64;}
term.inputChar=ch;term.ctrlHandler();if(window.event)window.event.cancleBubble=true;return false;}
else if((ctrl)||(!term.isPrintable(ch,true))){if(window.event)window.event.cancleBubble=true;return false;}
else if(term.isPrintable(ch,true)){if(term.blinkTimer)clearTimeout(term.blinkTimer);if(term.insert){term.cursorOff();term._scrollRight(term.r,term.c);}
term._charOut(ch);term.cursorOn();if((ch==32)&&(window.event))window.event.cancleBubble=true
else if((window.opera)&&(window.event))window.event.cancleBubble=true;return false;}}
return true;},hasSubDivs:false,hasLayers:false,termStringStart:'',termStringEnd:'',termSpecials:{0:'&nbsp;',1:'&nbsp;',9:'&nbsp;',32:'&nbsp;',34:'&quot;',38:'&amp;',60:'&lt;',62:'&gt;',127:'&loz;',0x20AC:'&euro;'},termStyles:[1,2,4,8],termStyleMarkup:{'r':1,'u':2,'i':4,'s':8},termStyleOpen:{1:'<span class="termReverse">',2:'<u>',4:'<i>',8:'<strike>'},termStyleClose:{1:'<\/span>',2:'<\/u>',4:'<\/i>',8:'<\/strike>'},assignStyle:function(styleCode,markup,htmlOpen,htmlClose){var tg=Terminal.prototype.globals;if((!styleCode)||(isNaN(styleCode))){if(styleCode>=256){alert('termlib.js:\nCould not assign style.\n'+s+' is not a valid power of 2 between 0 and 256.');return;}}
var s=styleCode&0xff;var matched=false;for(var i=0;i<8;i++){if((s>>>i)&1){if(matched){alert('termlib.js:\nCould not assign style code.\n'+s+' is not a power of 2!');return;}
matched=true;}}
if(!matched){alert('termlib.js:\nCould not assign style code.\n'+s+' is not a valid power of 2 between 0 and 256.');return;}
markup=String(markup).toLowerCase();if((markup=='c')||(markup=='p')){alert('termlib.js:\nCould not assign mark up.\n"'+markup+'" is a reserved code.');return;}
if(markup.length>1){alert('termlib.js:\nCould not assign mark up.\n"'+markup+'" is not a single letter code.');return;}
var exists=false;for(var i=0;i<tg.termStyles.length;i++){if(tg.termStyles[i]==s){exists=true;break;}}
if(exists){var m=tg.termStyleMarkup[markup];if((m)&&(m!=s)){alert('termlib.js:\nCould not assign mark up.\n"'+markup+'" is already in use.');return;}}
else{if(tg.termStyleMarkup[markup]){alert('termlib.js:\nCould not assign mark up.\n"'+markup+'" is already in use.');return;}
tg.termStyles[tg.termStyles.length]=s;}
tg.termStyleMarkup[markup]=s;tg.termStyleOpen[s]=htmlOpen;tg.termStyleClose[s]=htmlClose;},writeElement:function(e,t,d){if(document.layers){var doc=(d)?d:window.document;doc.layers[e].document.open();doc.layers[e].document.write(t);doc.layers[e].document.close();}
else if(document.getElementById){var obj=document.getElementById(e);obj.innerHTML=t;}
else if(document.all){document.all[e].innerHTML=t;}},setElementXY:function(d,x,y){if(document.layers){document.layers[d].moveTo(x,y);}
else if(document.getElementById){var obj=document.getElementById(d);obj.style.left=x+'px';obj.style.top=y+'px';}
else if(document.all){document.all[d].style.left=x+'px';document.all[d].style.top=y+'px';}},setVisible:function(d,v){if(document.layers){document.layers[d].visibility=(v)?'show':'hide';}
else if(document.getElementById){var obj=document.getElementById(d);obj.style.visibility=(v)?'visible':'hidden';}
else if(document.all){document.all[d].style.visibility=(v)?'visible':'hidden';}},setDisplay:function(d,v){if(document.getElementById){var obj=document.getElementById(d);obj.style.display=v;}
else if(document.all){document.all[d].style.display=v;}},guiElementsReady:function(e,d){if(document.layers){var doc=(d)?d:window.document;return((doc)&&(doc.layers[e]))?true:false;}
else if(document.getElementById){return(document.getElementById(e))?true:false;}
else if(document.all){return(document.all[e])?true:false;}
else return false;},_termString_makeKeyref:function(){var tg=Terminal.prototype.globals;var termString_keyref=tg.termString_keyref=new Array();var termString_keycoderef=tg.termString_keycoderef=new Array();var hex=new Array('A','B','C','D','E','F');for(var i=0;i<=15;i++){var high=(i<10)?i:hex[i-10];for(var k=0;k<=15;k++){var low=(k<10)?k:hex[k-10];var cc=i*16+k;if(cc>=32){var cs=unescape("%"+high+low);termString_keyref[cc]=cs;termString_keycoderef[cs]=cc;}}}},_extendMissingStringMethods:function(){if((!String.fromCharCode)||(!String.prototype.charCodeAt)){Terminal.prototype.globals._termString_makeKeyref();}
if(!String.fromCharCode){String.fromCharCode=function(cc){return(cc!=null)?Terminal.prototype.globals.termString_keyref[cc]:'';};}
if(!String.prototype.charCodeAt){String.prototype.charCodeAt=function(n){cs=this.charAt(n);return(Terminal.prototype.globals.termString_keycoderef[cs])?Terminal.prototype.globals.termString_keycoderef[cs]:0;};}}}}
Terminal.prototype.globals._initGlobals();var TerminalDefaults=Terminal.prototype.Defaults;var termDefaultHandler=Terminal.prototype.defaultHandler;var TermGlobals=Terminal.prototype.globals;var termKey=Terminal.prototype.globals.termKey;var termDomKeyRef=Terminal.prototype.globals.termDomKeyRef;var parserWhiteSpace={' ':true,'\t':true}
var parserQuoteChars={'"':true,"'":true,'`':true};var parserSingleEscapes={'\\':true};var parserOptionChars={'-':true}
var parserEscapeExpressions={'%':parserHexExpression}
function parserHexExpression(termref,pointer,echar,quotelevel){if(termref.lineBuffer.length>pointer+2){var hi=termref.lineBuffer.charAt(pointer+1);var lo=termref.lineBuffer.charAt(pointer+2);lo=lo.toUpperCase();hi=hi.toUpperCase();if((((hi>='0')&&(hi<='9'))||((hi>='A')&&((hi<='F'))))&&(((lo>='0')&&(lo<='9'))||((lo>='A')&&((lo<='F'))))){parserEscExprStrip(termref,pointer+1,pointer+3);return String.fromCharCode(parseInt(hi+lo,16));}}
return echar;}
function parserEscExprStrip(termref,from,to){termref.lineBuffer=termref.lineBuffer.substring(0,from)+
termref.lineBuffer.substring(to);}
function parserGetopt(termref,optsstring){var opts={'illegals':[]};while((termref.argc<termref.argv.length)&&(termref.argQL[termref.argc]=='')){var a=termref.argv[termref.argc];if((a.length>0)&&(parserOptionChars[a.charAt(0)])){var i=1;while(i<a.length){var c=a.charAt(i);var v='';while(i<a.length-1){var nc=a.charAt(i+1);if((nc=='.')||((nc>='0')&&(nc<='9'))){v+=nc;i++;}
else break;}
if(optsstring.indexOf(c)>=0){opts[c]=(v=='')?{value:-1}:(isNaN(v))?{value:0}:{value:parseFloat(v)};}
else{opts.illegals[opts.illegals.length]=c;}
i++;}
termref.argc++;}
else break;}
return opts;}
function parseLine(termref){var argv=[''];var argQL=[''];var argc=0;var escape=false;for(var i=0;i<termref.lineBuffer.length;i++){var ch=termref.lineBuffer.charAt(i);if(escape){argv[argc]+=ch;escape=false;}
else if(parserEscapeExpressions[ch]){var v=parserEscapeExpressions[ch](termref,i,ch,argQL[argc]);if(typeof v!='undefined')argv[argc]+=v;}
else if(parserQuoteChars[ch]){if(argQL[argc]){if(argQL[argc]==ch){argc++;argv[argc]=argQL[argc]='';}
else{argv[argc]+=ch;}}
else{if(argv[argc]!=''){argc++;argv[argc]='';argQL[argc]=ch;}
else{argQL[argc]=ch;}}}
else if(parserWhiteSpace[ch]){if(argQL[argc]){argv[argc]+=ch;}
else if(argv[argc]!=''){argc++;argv[argc]=argQL[argc]='';}}
else if(parserSingleEscapes[ch]){escape=true;}
else{argv[argc]+=ch;}}
if((argv[argc]=='')&&(!argQL[argc])){argv.length--;argQL.length--;}
termref.argv=argv;termref.argQL=argQL;termref.argc=0;}