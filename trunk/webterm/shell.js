var globalterm;
var interval = 0  // interval ID

if (!Array.indexOf) {
	Array.prototype.indexOf = function(obj) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == obj) {
				return i;
			}
		}
		return -1;
	};
}
String.prototype.template = function(){
    var args=arguments;
    return this.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
}
String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

Date.prototype.milTime = function() {
  return this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds();
}

function carriageReturn() {
  Terminal.prototype.globals.keyHandler({
    which     : globalterm.termKey.CR,
    _remapped : true
  });
}
function setNormal() {
  globalterm.conf.bgColor = '#181818';
  globalterm.rebuild();
  globalterm.write(' ');
}
function setColor(color) {
  globalterm.conf.bgColor = color;
  globalterm.rebuild();
  globalterm.write(' ');
}
function showClock(t) {
  var key = t.inputChar;
  if (key == 113 || key == termKey.ESC) { // "q, ESC" => quit
    document.getElementById('clock').setAttribute('style', 'display: none;');
    t.charMode = false;
    t.clear();
    t.prompt();
    return;
  }
  setTimeout('showClock(globalterm)', 1000);
  var d = new Date();
  var hr = d.getHours() + 100;
  var mn = d.getMinutes() + 100;
  var se = d.getSeconds() + 100;
  var tot ='' + hr + mn + se;
  document.hr1.src = './images/'+tot.substring(1,2)+'.gif';
  document.hr2.src = './images/'+tot.substring(2,3)+'.gif';
  document.mn1.src = './images/'+tot.substring(4,5)+'.gif';
  document.mn2.src = './images/'+tot.substring(5,6)+'.gif';
  document.se1.src = './images/'+tot.substring(7,8)+'.gif';
  document.se2.src = './images/'+tot.substring(8,9)+'.gif';
}

var Shell = (function(){
  /* Utils implementation
  每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每----------每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每*/
  //Remote Files
  function createXhr() {
    var activeX = [
      'MSXML2.XMLHTTP.3.0',
      'MSXML2.XMLHTTP',
      'Microsoft.XMLHTTP'
    ];
    var http;
    try {
      http = new XMLHttpRequest();
    } catch(e) {
      for(var i=0; i<activeX.length; ++i) {
        try{
          http = new ActiveXObject(this.activeX[i]);
        }catch(e){
          http = null;
        }
      }
    } finally {
      return http;
    }
  }
  var xmlHttp = createXhr();
  
  function fetchHttp(url, callback) {
    if (xmlHttp) {
      try {
        xmlHttp.open('GET', url, true);
        xmlHttp.onreadystatechange = function() {
          if(xmlHttp.readyState == 4)
            callback(xmlHttp.responseText);
        };
        xmlHttp.send(null);
      } catch (httperr) {
        callback(locale.error.network);
      }
    } else {
      callback(locale.error.xhr);
    }
  }
  function rnd() {
    rnd.seed = (rnd.seed * 9301 + 49297) % 233280;
    return rnd.seed / (233280.0);
  }
  rnd.today = new Date();
  rnd.seed = rnd.today.getTime();
  function rand(n) {
    return Math.ceil(rnd() * n);
  }
  function getFortune() {
    return locale.fortune[rand(10)];
  }
  function browserWidth() {
    if (document.body && document.body.offsetWidth)
      return document.body.offsetWidth;
    else if (window.innerWidth)
      return window.innerWidth;
    else if (document.documentElement && document.documentElement.clientWidth)
      return document.documentElement.clientWidth;
      
    return 0;
  }
  function browserHeight() {
    if (document.body && document.body.offsetHeight)
      return document.body.offsetHeight;
    else if (window.innerHeight)
      return window.innerHeight;
    else if (document.documentElement && document.documentElement.clientHeight)
      return document.documentElement.clientHeight;
    
    return 0;
  }
  function initClientInfo() {
    if(!window.geoip_country_name) {
      client.countryCode = "N/A";
      client.countryName = "N/A";
      client.City = "N/A";
      client.location = "N/A";
    } else {
      client.countryCode = geoip_country_code();
      client.countryName = geoip_country_name();
      client.city = geoip_city();
      client.location = client.city + ', ' + client.countryName;
    }
  }
  function randomRange(min, max) {
    if (min > max) return -1;
    if (min == max) return min;
    var r = parseInt(Math.random() * (max + 1), 10);
    return (r + min <= max ? r + min : r);
  }
  
  function iterateArray(write) {
    if (Math.round(Math.random() - 0.40) === 0) s = ' ';
    else s = '1';

    for (i = 0; i < mcolors.length; i++) { // prepare the next top line
      if (i === 0) repl = s;
      else repl = '%c(#' + mcolors[i - 1] + ')' + sp.charAt(randomRange(0, 61));
       
      firstline = firstline.replace(regex[i], repl);
    }
    repl = '%c(#fff)' + sp.charAt(randomRange(0, 61));
    for (i = 0; i < xperIter; i++) { // create the new verticals
      var p = randomRange(0, firstline.length);
      if (firstline.charAt(p) == ' ' || firstline.charAt(p) == '1')
        firstline = firstline.slice(0, p) + '%c(#fff)#' + firstline.slice(p + 1);
    }

    var rowtochange = randomRange(1, allRows.length - 1);
    allRows[rowtochange] = allRows[rowtochange].replace(regex[mcolors.length], repl);
    allRows.unshift(firstline);
    allRows.pop();

    if (write)
      globalterm.write(allRows);
  }
  
  function trimPath(p) {
    if (p.indexOf('/') == 0)
      p = p.substring(1, p.length);
    if (p.lastIndexOf('/') == p.length - 1)
      p = p.substring(0, p.length - 1);
    return p;
  }
  function getChild(name, node) {
    for(var i = 0; i < node.length; i++)
      if(name == node[i].name)
        return node[i];
    
    return false
  }
  function removeNode(nodeName) {
    //just remove /home/www/ childs.
    if(path.indexOf('home/www') == -1) return false;
    
    var wwwFolder = getNode('home/www');
    var nodeIndex = -1;
    for(var i = 0; i < wwwFolder.child.length; i++) {
      if(nodeName == wwwFolder.child[i].name) {
        nodeIndex = i;
        break;
      }
    }
    if(nodeIndex != -1) {
      wwwFolder.child.splice(nodeIndex, 1);
      return true;
    }
    return false;
  }
  function getNode(path) {
    var pathArray = path.split('/');
    if (pathArray.length == 1 && pathArray[0] == '') return root;
    
    var node = root;
    for(var i = 0; i < pathArray.length; i++) {
      if (node = getChild(pathArray[i], node.child))
        continue;
      else return false;
    }
    
    return node;
  }
  function getColorFile(fileName) {
    var dotIndex = fileName.lastIndexOf('.');
    if (dotIndex != -1) {
      var ext = fileName.substring(dotIndex + 1, fileName.length);
      if (ext == 'png' || ext == 'gif' || ext == 'jpg' || ext == 'pdf')
        return '%c(@palevioletred)' + fileName;
      else if(fileName == 'unixtoolbox_zh_CN.xhtml')
        return '%+n' + fileName + '%-n';
    }
    return '%c(@lightgrey)' + fileName;
  }
  function listing(t, node) {
    var list = [];
    var nameLen = 0;
    var spaceDriver = 5;
    if (node.child.length != 0 && typeof(node.child[0]) != 'string') {
      for(var i=0; i<node.child.length; i++) {
        if(node.child[i].name == '.' || node.child[i].name == '..') continue;
      
        if(node.child[i].name.length > nameLen)
          nameLen = node.child[i].name.length;
        
        list.push(node.child[i].name);
      }
    } else {
      list[0] = node.name;
      nameLen = node.name.length;
    }
    
    nameLen += 5;
    var dividers = Math.round(t.conf.cols / nameLen);
    var space;
    var spaceMissing;
    t.write('%n');
    var j = 1;
    for(var i=0; i<list.length; i++) {
      t.write(getColorFile(list[i]));
      spaceMissing = nameLen - list[i].length;
      space = '';
      while(spaceMissing > 0) {
        space += ' ';
        spaceMissing--;
      }
      t.write(space);
      j++;
      if(j == dividers) {
        t.write('%n');
        j = 1;
      }
    }
    t.write('%n ');
  }
  function longlisting(t, node, all) {
    var lines = [];
    if (node.child.length != 0 && typeof(node.child[0]) != 'string') {
      for(var i=0; i<node.child.length; i++) {
        if(!all && (node.child[i].name == '.' || node.child[i].name == '..'))
          continue;
        lines.push('%c(@lightgrey)' + node.child[i].permission + ' ' + node.child[i].link +  ' ' +
                   node.child[i].userid + ' ' + node.child[i].groupid + ' ' + node.child[i].size + ' ' +
                   node.child[i].time + ' ' + getColorFile(node.child[i].name));
      }
    } else {
      lines.push('%c(@lightgrey)' + node.permission + ' ' + node.link + ' ' + node.userid + ' ' +
                 node.groupid + ' ' + node.size + ' ' + node.time + ' ' + getColorFile(node.name));
    }
    
    t.write(lines, (lines.length > t.conf.rows - 2));
  }
  /*每每每每每每每每每每每每每每每每每每每每每每每每每每每-每 END 每----------每每每每每每每每每每每每每每每每每每每每每每每每每每每每每*/
  
  /* Utils(Cookie) implementation
  每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每----------每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每*/
  function createCookie(name, value, days) {
    var expires = "";
    if(days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 80 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    }
    //document.cookie = name + "=" + value + expires + "; path=/";
    document.cookie = name + "=" + escape(value) + expires + "; path=/";
  }
  function readCookie(name) {
    var nameEQ = name + "=";
    var allCookies = document.cookie;
    var pos = allCookies.indexOf(nameEQ)
    if(pos != -1) {
      var start = pos + nameEQ.length;          //Start of cookie value
      var end = allCookies.indexOf(";", start);  //End of cookie value
      if(end == -1) end = allCookies.length;
      return unescape(allCookies.substring(start, end));
    }
    return null;
  }
  function getFileSizeString(fileSize) {
    var strSize = fileSize;
    if (fileSize < 10)
      strSize = '     ' + fileSize;
    else if (fileSize < 100)
      strSize = '    ' + fileSize;
    else if (fileSize < 1000)
      strSize = '   ' + fileSize;
    else if (fileSize < 10000)
      strSize = '  ' + fileSize;
    
    return strSize;
  }
  function addFile(fileName, fileStream, fileDate) {
    var strSize = getFileSizeString(fileStream.length + 1);
    var strDate;
    if (typeof fileDate == 'undefined') {
      var d = new Date();
      var h = d.getHours();
      if (h < 10)
        h = '0' + h;
      var m = d.getMinutes();
      if (m < 10)
        m = '0' + m;
      var day = d.getDate();
      if (day < 10) day = ' ' + day;
      var mo = shortm[d.getMonth()];
      strDate = mo + ' ' + day + ' ' + h + ':' + m;
    } else {
      strDate = fileDate;
    }
    
    var wwwFolder = getNode('home/www');
    var file = getChild(fileName, wwwFolder.child);
    if (file) { //file exist => check also cookie
      if (!readCookie(fileName)) { // this is a system file!
        globalterm.write(locale.error.denied.template(fileName));
        return;
      } else {
        file.size = strSize;
        file.time = strDate;
      }
    } else {
      wwwFolder.child.push(new FileNode('-rw-r-----', '    1', ' greco', '  www', strSize, strDate, fileName, []));
    }
    createCookie(fileName, fileStream + strDate, 365);
  }
  function removeFile(fileName) {
    if (!readCookie(fileName)) { // this is a system file!
      globalterm.write(locale.error.denied.template(fileName));
      return;
    } else {
      if(removeNode(fileName))
        createCookie(fileName, '', 0);
      else
        globalterm.write(locale.error.path.template(fileName));
    }
  }
  function removeAllFile() {
    var cookieArray = document.cookie.split(';');
    var cookie;var fileName;
    var wwwFolder = getNode('home/www');
    for(var i=0; i<cookieArray.length; i++) {
      cookie = unescape(cookieArray[i]);
      fileName = cookie.split('=')[0].trim();
      if (fileName == 'clientlastlog' || fileName == 'style')
        continue;
      else {
        removeNode(fileName);
        createCookie(fileName, '', 0);
      }
    }
  }
  function initCookieFile() {
    var cookieArray = document.cookie.split(';');
    var cookie;
    var fileName;
    var fileContent;
    var fileDate;
    var nac;
    var wwwFolder = getNode('home/www');
    for(var i=0; i<cookieArray.length; i++) {
      cookie = unescape(cookieArray[i]);
      nac = cookie.split('=');
      fileName = nac[0].trim();
      if (fileName == 'clientlastlog' || fileName == 'style' || fileName.charAt(0) == '_')
        continue;
      else {
        fileContent = nac[1].slice(0, nac[1].length - 12);
        fileDate = nac[1].slice(nac[1].length - 12);
        wwwFolder.child.push(new FileNode('-rw-r-----', '    1', ' greco', '  www', 
                             getFileSizeString(fileContent.length + 1), fileDate, fileName, []));
      }
    }
  }
  /*每每每每每每每每每每每每每每每每每每每每每每每每每每每-每 END 每----------每每每每每每每每每每每每每每每每每每每每每每每每每每每每每*/
  
  /* Commands implementation
  每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每----------每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每*/
  var bootline    = 0;
  var bootask     = 0;
  var isBooting   = false;
  var uptime = ' up ' + randomRange(5, 380) + ' days, 04:32, '
                      + randomRange(0, 10) + ' users, load averages: 0.'
                      + randomRange(10, 99) + ', 0.' + randomRange(10, 89) + ', 0.'
                      + randomRange(10, 69);
  
  function checkBootLine(bootline, filename) {
    return bootline == filesContent[filename].length - 1
  }
  function rebootHandler(t) {
    if(t) {
      t.env.handler = t.handler;
      t.write(locale.bootask.taskQ[0]);
      bootask = 1
      return;
    }
    this.newLine();
    this.charMode = false;
    this.lock = true;
    
    if(this.isPrintable(key)) {
      var ch = String.fromCharCode(key);
      this.type(ch);
    }
    
    if (bootask != 0) {
      this.cursorOn();
      if (this.lineBuffer == 'yes') {
        if (bootask == 1) {
          bootask = 2;
          this.write(locale.bootask.taskQ[1]);
          this.newLine();
        } else {
          this.cursorOff();
          bootask = 0;
          this.write(locale.bootask.reboot[0]);
          this.newLine();
          this.write(locale.bootask.shutdown.template(Date(), randomRange(189, 21000), randomRange(70, 150), path, client.ip));
          this.write(pslong);
          this.write('%n%n%n');
          // OK start shutdown interval
          setTimeout("interval = setInterval('carriageReturn()', 300 )", 4000);
        }
      } else if (this.lineBuffer == 'no') {
        if (bootask == 1)
          this.write(locale.bootask.taskA[1]);
        else
          this.write(locale.bootask.taskA[2]);
        
        this.charMode = false;
        this.handler = this.env.handler;
        this.prompt();
        bootask == 0
        return;
      } else if (this.lineBuffer) {
        this.write(locale.bootask.remind);
        this.newLine();
      }
      
      this.lock = false;
      this.lineBuffer = '';
      return;
    }
    
    // normal sequence
    this.lock = true;
    var key = this.inputChar;
    this.cursorOff();
    
    if(key == 32) {   // space = pause
      if(interval === 0)
        interval = setinterval('carriageReturn()', 300);
      else {
        clearInterval(interval);
        interval = 0;
      }
    } else if (!isBooting) {
      // shutdown sequence
      if (checkBootLine(bootline, '/boot/shutdown')) {
        bootline = 0;
        clearInterval(interval);
        interval = 0;
        this.clear();
        this.conf.bgColor = 'blue';
        this.rebuild();
        this.write(' ');
        isBooting = true;
        setTimeout("setColor('#ffffff')", 1200);
        setTimeout('setNormal()', 1600);
        setTimeout("interval = setInterval('carriageReturn()', 300)", 2500);
      } else {  // normal shudown sequence
        this.write(filesContent['/boot/shutdown'][bootline]);
        bootline++;
        if (checkBootLine(bootline, '/boot/shutdown')) {
          clearInterval(interval);
          interval = setInterval('carriageReturn()', 4000);
        }
      }
    } else {
      if (checkBootLine(bootline, '/boot/kernel')) {
        clearInterval(interval);
        interval = 0;
        booline = 0;
        isBooting = false;
        this.newLine();
        cmdRedim(this, true);
        this.charMode = false;
        this.handler = this.env.handler;
        this.cursorOn();
        //setTimeout('globalterm.clear()', 3000);
        cmdRESET(term);
      } else {  // normal boot sequence
        this.write(filesContent['/boot/kernel'][bootline]);
        bootline++;
      }
    }
    
    this.lock = false;
  }
 
  function cmdAPROPOS(t) {
    cmdWHATIS(t);
  }
  function cmdBASH(t) {
    t.clear();
  }
  function cmdBROWSE(t) {
  
  }
  function cmdBROWSER(t) {
    t.write(locale.info.browser.template(client.ip, 
        navigator.appCodeName, navigator.appName, navigator.appVersion,
        navigator.userAgent, navigator.platform, location.hostname,
        screen.width, screen.height, browserWidth(), browserHeight()));
  }
  function cmdCAL(t) {
  
  }
  function isRightFile(t, file) {
    var filePath = trimPath(file);
    var fileNode = null;
    if (filePath.indexOf('..') != -1) {
      filePath = trimPath(filePath.substring(2,filePath.length));
      filePath = path.substring(0, path.lastIndexOf('/')) + '/' + filePath;
    } else if (filePath.charAt(0) == '.') {
      filePath = path + '/' + trimPath(filePath.substring(2,filePath.length));
    } else if (file.charAt(0) == '/') {
      filePath = file;
    } else {
      filePath = path + '/' + file;
    }
    
    if (filePath.indexOf('home/www') == -1) {
      t.write(locale.error.denied.template(file));
      return false;
    }
    
    fileNode = getNode(trimPath(filePath));
    if (!fileNode) return false;
    
    return fileNode;
  }
  function isBinaryFile(fileName) {
    var extReg = new RegExp("^.*?\.(gif|jpg|pdf|png|bmp)$");
    if (extReg.test(fileName)) return true;
    return false;
  }
  function displaymore(content) {
    globalterm.write('%c(@lightgrey)' + content, true);
    globalterm.rawMode = false;
  }
  function displaycat(content) {
    globalterm.write('%c(@lightgrey)' + content, true);
    globalterm.rawMode = false;
  }
  function catFile(t, ckf) {
    if (t.argv.length == 1) {
      t.write(locale.error.cat);
      return;
    }
    
    var cnt
    var fileNode = isRightFile(t, t.argv[1]);
    if (fileNode) {
      var fcontent = readCookie(fileNode.name);
      if (fcontent) {
        cnt = fcontent.slice(0, fcontent.length - 12);
        t.write('%c(@lightgrey)' + cnt + '%n');
        return;
      }
      if (isBinaryFile(fileNode.name)) {
        //window.open('http://silenceisdefeat.org/~greco/' + httpFilePath[fileNode.name], fileNode.name)
        window.open('./' + httpFilePath[fileNode.name], fileNode.name)
      } else {
        t.rawMode = true;
        t.write('%c(@lightgrey)Patience...%n');
        //fetchHttp('http://silenceisdefeat.org/~greco/' +  httpFilePath[fileNode.name], displaymore);
        fetchHttp('./' +  httpFilePath[fileNode.name], ckf);
      }
      
    } else {
      if (path.indexOf('home/www') == -1) return;
      t.write('%c(@lightgrey)cat ' + t.argv[1] + ' : File not found%n');
    }
  }
  function cmdCAT(t) {
    catFile(t, displaycat);
  }
  function isRightPath(p) {
    var isAbsolute = false;
    if(p.charAt(0) == '/') isAbsolute = true;
    
    p = trimPath(p);
    var rightPath;
    if (p.indexOf('..') != -1) {
      if (p.length == 2 || p == '../') {
        if(path.lastIndexOf('/') == 0)
          return '/';
        else
          return path.substring(0, path.lastIndexOf('/'));
      }
      if(path == '/') return false;
      else {
        rightPath = path.substring(0, path.lastIndexOf('/')) + p.substring(2, p.length);
        if (!getNode(trimPath(rightPath))) return false
        else return rightPath;
      }
    } else if (p.indexOf('.') != -1) {
      if (p == '.' || p == './') return path; //return current path
      rightPath = (path == '/' ? '' : path) + p.substring(1, p.length);
    }
    
    if (isAbsolute) rightPath = p;
    else rightPath = (path == '/' ? '' : path) + '/' + p;
    
    var fileNode = getNode(trimPath(rightPath));
    if (!fileNode) // not existed!
      rightPath = false;
    else if (fileNode.child.length == 0)
      rightPath = false;
    
    return rightPath;
  }
  function cmdCD(t) {
    if(t.argv[1] == '/')
      path = '/';
    else if(t.argv.length == 1 || t.argv[1] == '~')
      path = '/home/www';
    else {
      var cdPath = isRightPath(t.argv[1])
      if(cdPath) {
        path = '/' + trimPath(cdPath);
      } else {
        t.write(locale.error.path.template(t.argv[1]));
        return;
      }
    }
  	// Change the prompt
  	if (path == '/home/www')
  		t.ps = '[' + t.user + '@silenceisdefeat.org ~]#';
  	else
  		t.ps = '[' + t.user + '@silenceisdefeat.org ' + path + ']#';
  }
  function cmdCLEAR(t) {
    t.clear();
  }
  function cmdCLOCK(t) {
    t.charMode = true;
    t.cursorOff();
    t.clear();
    document.getElementById('clock').setAttribute('style', 'display: block;');
    showClock(globalterm);
    t.lock = false;
    return;
  }
  function cmdDATE(t) {
    t.write('%c(@lightgrey)' + Date());
  }
  function cmdDF(t) {
  
  }
  function cmdECHO(t) {
    if (t.argv.length != 1 && t.argv[t.argv.length - 2] == '>') {
      // redirect to a file
      var file = t.argv[t.argv.length -1];
      if (path != '/home/www') {
        t.write(locale.error.denied.template(path));
        return;
      }
      var fs = '';
      for (var i=1; i<t.argv.length - 2; i++) {
        fs += t.argv[i];
        if (i + 1 != t.argv.length - 2)
          fs += ' ';
      }
      addFile(file, fs);
    } else if (t.argv.length != 1 && t.argv[1] == '$PATH') {
      t.write('%c(@lightgrey)/bin:/sbin:/etc');
    } else {
      var s = '%c(@lightgrey)';
      for (var j=1; j<t.argv.length; j++) {
        s += t.argv[j];
        if (j + 1 != t.argv.length)
          s += ' ';
      }
      if (s == '%c(@lightgrey)') s += ' ';
      t.write(s);
    }
  }
  function cmdEXIT(t) {
    cmdLOGOUT(t);
  }
  function cmdFORTUNE(t) {
    t.write(getFortune());  
  }
  function cmdHELP(t) {
    t.write(locale.helpPage);
  }
  function cmdHISTORY(t) {
    t.write(t.history);
  }
  function cmdHOSTNAME(t) {
    if(t.argv.length == 1 || t.argv[1] == '-f')
      t.write('%c(@lightgrey)silenceisdefeat.org');
    else if (t.argv[1] == '-s')
      t.write('%c(@lightgrey)silenceisdefeat');
    else if (t.argv[1] == '-i')
      t.write('%c(@lightgrey)' + host.ip);
    else if (t.argv[1] == '-fsi')
      t.write('%c(@lightgrey)silenceisdefeat.org ' + host.ip);
    else
      t.write(locale.error.illegal.template(t.argv[1], t.argv[0], 'fsi', ''));
  }
  function cmdID(t) {
  
  }
  function cmdINFO(t) {
    t.write(locale.infoPage);
  }
  function cmdLESS(t) {
    catFile(t, displaymore);
  }
  function cmdLL(t) {
  
  }
  function cmdLOGIN(t) {
    if((t.argc == t.argv.length) || (t.argv[t.argc] === ''))
      t.write(locale.info.login[0]);
    else {
      t.env.getPassword = true;
      t.env.username = t.argv[t.argc];
      t.write(locale.info.login[1]);
      t.rawMode = true;
      t.lock = false;
      return;
    }
  }
  function cmdLOGOUT(t) {
    t.close();
    document.getElementById('welcome').setAttribute('style','display:block');
  }
  function cmdLS(t) {
    if (t.argv.length == 1) {
      listing(t, getNode(trimPath(path)));
    } else if (t.argv[1] == '-l' || t.argv[1] == '-la' || t.argv[1] == '-al') {
      var lsPath = trimPath(path);
      if (t.argv.length > 2) {
        if (t.argv[2] == '..')
          lsPath = lsPath.substring(0, lsPath.lastIndexOf('/'));
        else if (t.argv[2] == '.')  ; //path = current path, nothing to do.
        else
          lsPath = trimPath(t.argv[2]);
      }
      
      var node = getNode(lsPath);
      if(node) {
        longlisting(t, node, (t.argv[1].indexOf('a') != -1));
      } else {
        t.write(locale.error.path);
      }
    } else {
      t.write(locale.error.illegal.template(t.argv[1], t.argv[0] , 'la', '[file]'));
    }
  }
  function cmdMAN(t) {
    
  }
  
  var matrixrounds;
  var matrixemptystart = false;
  function matrixHandler(initterm) {
    var repl;
    var i = 0;

    if (initterm) {
      if (initterm.argv.indexOf('-s') != -1) matrixemptystart = true;
      else matrixemptystart = false;
  
      matrixrounds = globalterm.conf.rows * 3;
      firstline = ''; // reset and precompile the regexp
      xperIter = Math.round(globalterm.conf.cols / 45); // new cols per
      // iteration
      initterm.env.handler = initterm.handler;
      dim = initterm.getDimensions();

      for (i = 0; i < mcolors.length; i++)
        regex[i] = eval('\/%c\\(#' + mcolors[i] + '\\).\/g');
      regex[mcolors.length] = eval('\/%c\\(#fff\\).\/g'); // only change white
      // char
      for (i = 0; i < initterm.conf.cols - 1; i++)
        firstline = firstline + ' ';
      for (i = 0; i <= initterm.conf.rows; i++)
        allRows[i] = firstline;

      return;
    }

    this.lock = true;
    // Check pressed key
    var key = this.inputChar;
    if (key == 32) { // space = pause
      if (interval === 0) {
        interval = setInterval('carriageReturn()', 1000);
      } else {
        clearInterval(interval);
        interval = 0;
      }
    }
    if (key == 113 || key == termKey.ESC) { // "q, ESC" => quit
      clearInterval(interval);
      interval = 0;
      this.charMode = false;
      this.handler = this.env.handler;
      this.clear();
      this.prompt();
      return;
    } else {
      if (!matrixemptystart && matrixrounds > 0)
        while (matrixrounds > 0) {
          iterateArray(false);
          matrixrounds--;
        }
        
      iterateArray(false);
      this.write(allRows);
    }

    this.lock = false;
  }
  function cmdMATRIX(t) {
    t.cursorOff();
    t.charMode = true;
    t.write(locale.info.matrix);
    matrixHandler(t);
    interval = setInterval('carriageReturn()', 1000);
    t.handler = matrixHandler;
    t.lock = false;
    return;
  }
  function cmdMORE(t) {
    catFile(t, displaymore);
  }
  function cmdNUM(t) {
    
  }
  function cmdPING(t) {
    
  }
  function cmdPS(t) {
    
  }
  function cmdPR(t) {
    
  }
  function cmdPWD(t) {
    t.write('%c(@lightgrey)' + path);
  }
  function cmdRELOAD(t) {
    window.location.href = window.location.href;
  }
  function cmdREDIM(t) {
    cmdRedim(t);
  }
  function cmdREBOOT(t) {
    t.charMode = true;
    rebootHandler(t);
    t.handler = rebootHandler;
    setTimeout('carriageReturn()', 100);
    t.lock = false;
    return;
  }
  function cmdRedim(t, manual) {
    var dim = t.getDimensions();
    var neww = Math.round((t.conf.cols / dim.width) * browserWidth()) - 2;
    var newh = Math.round((t.conf.rows / dim.height) * browserHeight()) - 1;
    
    if ((t.argv) && t.argv.length > 1 || manual) {
      t.write(locale.terminalInfo[0].template(dim.width, dim.height));
      t.write(locale.terminalInfo[1].template(browserWidth(), browserHeight()));
      t.write(locale.terminalInfo[2].template(t.conf.cols, t.conf.rows));
      t.write(locale.terminalInfo[3].template(neww, newh));
    } else if (!(t.argv) || t.argv.length == 1) {
      if (neww !== 0) t.resizeTo(neww, newh);
    }
  }
  function cmdRESET(t) {
    t.write(' ');
    t.clear();
    t.open();
    return;
  }
  function cmdRM(t) {
    if (t.argv.length == 1) return;
    if (t.argv[1] == '/')
      t.write(locale.error.sorry);
    else if (t.argv[1] == '-rf' && t.argv[2] == '/')
      t.write(locale.error.sorry);
    else if (t.argv[1].charAt(0) == '/')
      t.write(locale.error.rm.template('no absolute path,'));
    else if (path != '/home/www')
      t.write(locale.error.rm.template(''));
    else if (t.argv[1] == '*')
      removeAllFile();
    else if (t.argv.length == 3 && t.argv[1] == '-rf' && t.argv[2].charAt(0) != '/')
      removeFile(t.argv[2]);
    else
      removeFile(t.argv[1]);
  }
  function cmdSU(t) {
    t.env.getPassword = true;
    t.env.username = t.argv[t.argc];
    t.write('%c(@lightgrey)Password: ');
    t.rawMode = true;
    t.lock = false;
    return;
  }
  function cmdTIME(t) {
    t.write('%c(@lightgrey)' + new Date().milTime());
  }
  function cmdTOP(t) {
    t.write(locale.error.denied.template('top'));
  }
  function cmdUNAME(t) {
    if (t.argv.length == 1 || t.argv[1] == '-s')
      t.write('%c(@lightgrey)OpenBSD');
    else if (t.argv[1] == '-i')
      t.write('%c(@lightgrey)silenceisdefeat');
    else if (t.argv[1] == '-m' || t.argv[1] == '-p')
      t.write('%c(@lightgrey)i386');
    else if (t.argv[1] == '-n')
      t.write('%c(@lightgrey)brunner.silenceisdefeat.org');
    else if (t.argv[1] == '-a')
      t.write('%c(@lightgrey)OpenBSD brunner.silenceisdefeat.org 4.0 GENERIC#0 i386');
    else if (t.argv[1] == '-v')
      t.write('%c(@lightgrey)GENERIC#0');
    else if (t.argv[1] == '-r')
      t.write('%c(@lightgrey)4.0');
    else
        t.write(locale.error.illegal.template(t.argv[1], t.argv[0], 'aimnprsv', ''));
  }
  function cmdUPTIME(t) {
    t.write('%c(@lightgrey)' + new Date().milTime() + uptime);
  }
  function cmdWEATHER(t) {
    
  }
  function cmdWETTER(t) {
    
  }
  function cmdWHATIS(t) {
    t.write('sss');
  }
  function cmdWHO(t) {
    cmdWHOAMI(t);
  }
  function cmdWHOAMI(t) {
    t.write('%c(@lightgrey)' + t.user);
  }

  /*每每每每每每每每每每每每每每每每每每每每每每每每每每每-每 END 每----------每每每每每每每每每每每每每每每每每每每每每每每每每每每每每*/

  /* Terminal and Handlers
  每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每----------每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每每*/
  var termInitHandler = function() {
    this.user = 'www';
    globalterm = this;  //Terminal Instance
    cmdRedim(this);
    // outout a start up screen, try to read the last log value from cookie
    var clientLastLog = readCookie('clientlastlog');
    initClientInfo();
    var clientLocation = '';
    if (client.location != 'N/A')
     clientLocation= '(' + client.location + ')';
    if(!clientLastLog) {
      clientLastLog = locale.clientLastLog[0].template(Date(), client.ip, clientLocation);
    }
    createCookie('clientlastlog', clientLastLog, 365);
    this.write([
      clientLastLog,
      locale.clientLastLog[1].template(Date(), client.ip, clientLocation),
      locale.clientLastLog[2],locale.clientLastLog[3],locale.clientLastLog[4],
      locale.clientLastLog[5],
      '%c()'
    ]);
    this.newLine();
    this.write(getFortune());
    this.prompt();
    
    //Init User Files
    initCookieFile();
  }
  var controlHandler = function() {
    if(this.inputChar == termKey.ETX) {
      this.newLine();
      this.prompt();
    } else if (this.inputChar == termKey.EOT) {
      this.close();
    }
  }
  var commandHandler = function() {
    this.newLine();
    //check for raw mode first (should not be parsed)
    if (this.rawMode) {
      if(this.env.getPassword) {
        //sample password handler (lineBuffer == store username ?)
        if(this.lineBuffer == this.env.username) {
          this.user = this.env.username;
          this.ps = '[' + this.user + '@silenceisdefeat.org ~]#';
        } else {
          this.write(locale.info.login[2]);
        }
        this.env.username = '';
        this.env.getPassword = false;
      }
      this.rawMode = false;
      this.prompt();
      //leave in normal mode
      return;
    }
    // normal command parsing
    parseLine(this);
    if(this.argv.length === 0) ;  /* jsl:pass */ //no command line input
    else if(this.argQL[0])        //first argument quoted -> error
      this.write(locale.error.argument);
    else {
      var cmd = this.argv[this.argc++];
      /*
        apropos,bash,browse,browser,cal,cat,cd,clear,clock,date,df,each,exit,
        fortune,help,history,hostname,id,info,less,ll,login,logout,ls,man,matrix,
        more,num,ping,ps,pr,pwd,reboot,reload,redim,reset,rm,su,time,top,uname,
        uptime,weather,wetter,whatis,who,whoami
      */
      try {
        eval('cmd' + cmd.toUpperCase() + '(this)');
      } catch (exception) {
        if(FILES_SBIN.indexOf(cmd) != -1)
          this.write(locale.error.denied.template(this.argv[0]));
        else
          this.write(locale.error.command.template(this.argv[0]));
      }
    }
    
    if(!this.rawMode && !this.charMode) this.prompt();
  }
  
  var term = new Terminal({
    id            : 1,
    x             : 5,
    y             : 5,
    frameWidth    : 0,
    blinkDelay    : 1200,
    crsrBlinkMode : true,
    crsrBlockMode : true,
    printTab      : true,
    printEuro     : false,
    catchCtrlH    : true,
    historyUnique : true,
    ps            : '[www@silenceisdefeat.org ~]#',
    cols          : 100,
    rows          : 32,
    greeting      : '',
    wrapping      : true,
    initHandler   : termInitHandler,
    ctrlHandler   : controlHandler,
    handler       : commandHandler
  });
  /*每每每每每每每每每每每每每每每每每每每每每每每每每每每-每 END 每----------每每每每每每每每每每每每每每每每每每每每每每每每每每每每每*/
  
  return {
    init : function() {
      TermGlobals.assignStyle(16, 'o', '<a class="tlink" href="http://www.masswerk.at">', '<\/a>');
      TermGlobals.assignStyle(32, 'm', '<a class="tlink" href="http://www.masswerk.at">', '<\/a>');
      TermGlobals.assignStyle(64, 'n', '<a class="tlink" href="http://silenceisdefeat.org/~greco/unixtoolbox_zh_CN.xhtml">', '<\/a>');
      TermGlobals.assignStyle(128, 'l', '<a class="tlink" href="http://www.masswerk.at">', '<\/a>');
      term.open();
    }
  }
}());

window.onload = function() {
  document.getElementById('welcome').innerHTML = locale.welcome;
  Shell.init();
}