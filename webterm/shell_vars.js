var shortm  = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var mcolors = ['030', '033', '063', '093', '393', '0c3', '3c0', 
               '6c3', '0f0', '6f3', '3f0', '9f3', 'ff3', 'fff'];
var regex   = [];
var sp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabscdefghijklmnopqrstuvwxyz23456789#$?@';
var allRows = [];

var digitals = new Array();
for (var i=0; i<10; i++) {
  digitals[i] = new Image();
  digitals[i].src = './images/' + i + '.gif';
}
digitals[10] = new Image();
digitals[10].src = '.images/digital/colon.jpg';

var FILES_SBIN = [
    'sysctl', 'netstat', 'browser', 'passwd', 'ifconfig',
		'route', 'mount', 'reboot', 'halt', 'shutdown'];

var path = "/home/www";   // default path
//################# TODO: start ###################################

var files_root_n = ['bin', 'etc', 'home', 'tmp', 'sbin', 'usr', 'var'];
var files_root_s = ['   512', '   512', '  1024', '   512', '   512', '   512',
		'   512'];
var files_root_t = ['Jan 23 00:13', 'Feb  2 14:36', 'Jan 23 00:13',
		'Nov 10  2007', 'Nov 10  2007', 'Nov 10  2007', 'Nov 10  2007'];
var files_root = [files_root_n, files_root_s, files_root_t,
		'%c(@lightgrey)drwxr-x---   1 root  wheel'];
var files_etc_n = ['passwd', 'group', 'rc.conf', 'master.passwd', 'hosts',
		'crontab'];
var files_etc_s = ['   766', '   266', '  3061', '  3960', '   766', '  1852'];
var files_etc_t = ['Jan 23 00:13', 'Jan 23 00:13', 'Feb  2 14:36',
		'Jan 23 00:13', 'Nov 10  2007', 'Nov 26 17:28'];
var files_etc = [files_etc_n, files_etc_s, files_etc_t,
		'%c(@lightgrey)-rw-r-----   1 root  wheel'];
var files_home_n = ['www'];
var files_home_s = ['   766'];
var files_home_t = ['Nov 10  2007'];
var files_home = [files_home_n, files_home_s, files_home_t,
		'%c(@lightgrey)drwxr-xr-x   1 root  wheel'];
var files_tmp_n = ['test'];
var files_tmp_s = ['   512'];
var files_tmp_t = ['Jun 11  2007'];
var files_tmp = [files_tmp_n, files_tmp_s, files_tmp_t,
		'%c(@lightgrey)drwxrwx---   1 root  wheel'];
var files_var_n = ['log'];
var files_var_s = ['   512'];
var files_var_t = ['Jun 11  2007'];
var files_var = [files_var_n, files_var_s, files_var_t,
		'%c(@lightgrey)drwxrwx---   1 root  wheel'];
var files_usr_n = ['share'];
var files_usr_s = ['   512'];
var files_usr_t = ['Oct 21  2006'];
var files_usr = [files_usr_n, files_usr_s, files_usr_t,
		'%c(@lightgrey)drwxrwxr-x   1 root  wheel'];
var files_share_n = ['man'];
var files_share_s = ['   512'];
var files_share_t = ['Oct 21  2006'];
var files_share = [files_share_n, files_share_s, files_share_t,
		'%c(@lightgrey)drwxrwxr-x   1 root  wheel'];
var files_man_n = ['echo', 'cal', 'clock', 'hostname', 'ls', 'matrix', 'redim',
		'reload', 'reset', 'weather', 'whereami'];
var files_man_s = ['   252', '   287', '   352', '   173', '   281', '   361',
		'   451', '   353', '   198', '   232', '   112'];
var files_man_t = ['Nov 21  2007', 'Jan 31  2008', 'Nov 21  2007',
		'Nov 21  2007', 'Nov 21  2007', 'Nov 21  2007', 'Nov 21  2007',
		'Nov 21  2007', 'Nov 21  2007', 'Feb 01  2008', 'Nov 21  2007'];
var files_man = [files_man_n, files_man_s, files_man_t,
		'%c(@lightgrey)-rw-rw-r--   1 root  wheel'];
var files_bin_n = ['apropos', 'browse', 'browser', 'cal', 'cat', 'clear',
		'clock', 'cd', 'date', 'df', 'echo', 'fortune', 'history', 'hostname',
		'help', 'id', 'info', 'logout', 'ls', 'matrix', 'more', 'ping', 'ps',
		'pwd', 'pr', 'reload', 'reset', 'top', 'su', 'uname', 'whereami', 'rm',
		'time', 'uptime', 'who', 'weather', 'whoami'];
var files_bin_s = ['  1933', '  3061', '  3960', '   766', '  1150', '  2170',
		'  1834', '  1650', ' 81933', '   695', '  1507', '  1327', '  1852',
		'  1140', '  1933', '   256', '  1678', '  1232', '  5150', '   593',
		'  3595', '  1698', '  3855', '  7159', '  1353', '  3695', '  1435',
		'  1156', '   815', '   193', '  2565', '  5466', '  1357', '   150',
		' 19364', '   384', '  1744'];
var files_bin_t = ['Oct 21  2006', 'Oct 21  2006', 'Oct 21  2006',
		'Oct 21  2006', 'Oct 21  2006', 'Oct 21  2006', 'Oct 21  2006',
		'Oct 22  2006', 'Oct 22  2006', 'Oct 21  2006', 'Oct 21  2006',
		'Oct 21  2006', 'Oct 21  2006', 'Feb 10 01:23', 'Feb 10 01:24',
		'Oct 21  2006', 'Jun 11  2007', 'Oct 21  2006', 'Oct 21  2006',
		'Oct 21  2006', 'Oct 21  2006', 'Oct 21  2006', 'Oct 21  2006',
		'Oct 21  2006', 'Jun 11  2007', 'Oct 21  2006', 'Oct 21  2006',
		'Oct 21  2006', 'Nov 10  2007', 'Oct 21  2006', 'Oct 21  2006',
		'Oct 21  2006', 'Oct 21  2006', 'Oct 21  2006', 'Jan 23 00:13',
		'Jan 23 00:13', 'Feb 10 01:24'];
var files_bin = [files_bin_n, files_bin_s, files_bin_t,
		'%c(@lightgrey)-rwxr-x--x   1 root  wheel'];
var files_sbin_n = ['sysctl', 'netstat', 'browser', 'passwd', 'ifconfig',
		'route', 'mount', 'reboot', 'halt', 'shutdown'];
var files_sbin_s = ['  1933', '  3061', '  3960', '   766', '  1150', '  1834',
		'  1650', '   933', '   695', '  1507'];
var files_sbin_t = ['Feb 10 01:23', 'Feb 10 01:24', 'Oct 21  2006',
		'Oct 21  2006', 'Oct 21  2006', 'Oct 21  2006', 'Jun 11  2007',
		'Oct 21  2006', 'Oct 21  2006', 'Oct 21  2006'];
var files_sbin = [files_sbin_n, files_sbin_s, files_sbin_t,
		'%c(@lightgrey)-rwxr-x---   1 root  wheel'];
var files_www_n = ['about.txt', 'cb.txt', 'exploring.gif', 'favicon.ico',
		'index.html', 'shell.js', 'sitemap.xml', 'termlib.js','%c(@palevioletred)termlib_parser.js', 
    '%c(@palevioletred)unixtoolbox_cn.book.pdf', '%c(@palevioletred)unixtoolbox_cn.book2.pdf',
		'%c(@palevioletred)unixtoolbox_cn.pdf', 'unixtoolbox_cn.txt', '%+nunixtoolbox_cn.xhtml%-n',
		'vars.js.php'];
var files_www_s = ['  1045', '  4033', ' 98166', '  1150', '  1933', ' 25695',
		'   766', ' 64720', '  5838', '272458', '271664', '345472', '124113',
		'156225', '  1992'];
var files_www_t = ['Feb 15 01:31', 'Feb 11 02:06', 'Jul 23  2004',
		'Jan 31 15:17', 'Feb 10 16:53', 'Feb  5 00:52', 'Feb 10 01:13',
		'Feb 10 01:13', 'Feb 10 02:14', 'Feb 10 02:14', 'Feb 10 02:14',
		'Feb 10 02:14', 'Feb 25 04:20', 'Feb 11 01:47', 'Feb 11 02:50'];
var files_www = [files_www_n, files_www_s, files_www_t,
		'%c(@lightgrey)-rw-r-----   1 colin   www'];
var tree = ['/', '/etc', '/tmp', '/bin', '/home', '/home/www', '/sbin', '/usr',
		'/usr/share', '/usr/share/man', '/var'];
var tree_files = [files_root, files_etc, files_tmp, files_bin, files_home,
		files_www, files_sbin, files_usr, files_share, files_man, files_var];
function FileNode(p, l, uid, gid, s, t, n, c) {
  this.permission = p;
  this.link = l;
  this.userid = uid;
  this.groupid = gid;
  this.size = s;
  this.time = t;
  this.name = n;
  this.child = c;
}
var root = new FileNode('', 26, 'root', 'wheel', 1024, 'Feb 18 1:15', '/', [
  new FileNode('drwxr-xr-x', '   23', 'root', 'wheel', '  1024', 'Feb 18 18:15', '.', []),
  new FileNode('drwxr-xr-x', '   23', 'root', 'wheel', '  1024', 'Feb 18 18:15', '..', []),
  new FileNode('drwxr-xr-x', '    2', 'root', 'wheel', '  1024', 'Sep 16  2006', 'bin', []),
  new FileNode('drwxr-xr-x', '   29', 'root', 'wheel', '  3584', 'Apr  1 23:04', 'etc', []),
  new FileNode('drwxr-xr-x', ' 7105', 'root', 'wheel', '102752', 'Jan 23 00:13', 'home', [
    new FileNode('drwxr-xr-x', '   23', 'root', 'wheel', '  1024', 'Feb 18 18:15', '.', []),
    new FileNode('drwxr-xr-x', '   23', 'root', 'wheel', '  1024', 'Feb 18 18:15', '..', []),
    new FileNode('drwxr-xr-x', '   23', ' greco', '  www', '  1024', 'Feb 18 18:15', 'www', [
      new FileNode('drwxr-xr-x', '   23', ' greco', '  www', '  1024', 'Feb 18 18:15', '.', []),
      new FileNode('drwxr-xr-x', '   23', ' greco', '  www', '  1024', 'Feb 18 18:15', '..', []),
      new FileNode('-rw-r-----', '    1', ' greco', '  www', '  1045', 'Feb 15 01:31', 'about.txt', []),
      new FileNode('-rw-r-----', '    1', ' greco', '  www', '  1045', 'Feb 15 01:31', 'greco.pdf', []),
      new FileNode('drwxr-xr-x', '    3', ' greco', '  www', '   512', 'Mar 31 23:16', 'images', [
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  2487', 'Mar 31 23:15', '0.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  2288', 'Mar 31 23:15', '1.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  2843', 'Mar 31 23:15', '2.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  2799', 'Mar 31 23:15', '3.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  3151', 'Mar 31 23:15', '4.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  2739', 'Mar 31 23:15', '5.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  2801', 'Mar 31 23:15', '6.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  2640', 'Mar 31 23:16', '7.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  2967', 'Mar 31 23:16', '8.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  3325', 'Mar 31 23:16', '9.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '  2359', 'Mar 31 23:15', 'colon.gif', []),
        new FileNode('-rw-r-----', '    1', ' greco', '  www', '    43', 'Mar 31 03:43', 's.gif', [])
      ])
    ])
  ]),
  new FileNode('drwxr-xr-x', '    2', 'root', 'wheel', '  2048', 'Sep 16  2006', 'sbin', []),
  new FileNode('drwxrwxrwt', '    7', 'root', 'wheel', ' 17408', 'Apr  2 01:03', 'tmp', []),
  new FileNode('drwxr-xr-x', '   18', 'root', 'wheel', '   512', 'Sep 16  2006', 'usr', [
    new FileNode('drwxr-xr-x', '    3', 'root', 'wheel', '  1024', 'Feb 18 18:15', '.', []),
    new FileNode('drwxr-xr-x', '    3', 'root', 'wheel', '  1024', 'Feb 18 18:15', '..', []),
    new FileNode('drwxr-xr-x', '    3', 'root', 'wheel', '   512', 'Sep 16 2006', 'share', [
      new FileNode('drwxr-xr-x', '    3', 'root', 'wheel', '  1024', 'Feb 18 18:15', '.', []),
      new FileNode('drwxr-xr-x', '    3', 'root', 'wheel', '  1024', 'Feb 18 18:15', '..', []),
      new FileNode('drwxr-xr-x', '    3', 'root', 'wheel', '   512', 'Nov  4 2005', 'man', [])
    ])
  ]),
  new FileNode('drwxr-xr-x', '   29', 'root', 'wheel', '  1024', 'Jan  6 14:38', 'var', [])
]);
var httpFilePath = {
  'about.txt' : 'about.txt'
}
//################# TODO: END ###################################

var pslong = [  //TODO: move to vars.js.php
		'%c(@lightgrey)USER   PID \%CPU  \%MEM    VSZ   RSS  TT  STAT STARTED      TIME COMMAND',
		'www  50442  0.0  1.5 23328 15352  ??  I     8:00PM   0:03.18  /usr/local/sbin/httpd',
		'www  50443  0.0  1.5 23872 15880  ??  I     8:00PM   0:03.63  /usr/local/sbin/httpd',
		'www  50444  0.0  1.4 22864 14956  ??  I     8:00PM   0:03.06  /usr/local/sbin/httpd',
		'www  50445  0.0  1.4 22600 14700  ??  I     8:00PM   0:01.86  /usr/local/sbin/httpd',
		'www  50447  0.0  1.5 23824 15824  ??  I     8:00PM   0:01.58  /usr/local/sbin/httpd',
		'www  50453  0.0  1.4 22424 14460  ??  I     8:00PM   0:01.97  /usr/local/sbin/httpd',
		'www  50454  0.0  1.4 22732 14824  ??  I     8:00PM   0:02.87  /usr/local/sbin/httpd',
		'www  50455  0.0  1.4 22776 14876  ??  I     8:00PM   0:01.99  /usr/local/sbin/httpd',
		'www  50456  0.0  1.5 23772 15816  ??  I     8:00PM   0:02.17  /usr/local/sbin/httpd',
		'www  50457  0.0  1.4 22656 14700  ??  I     8:00PM   0:01.51  /usr/local/sbin/httpd',
		'www  50701  0.0  1.4 22728 14756  ??  I     8:20PM   0:02.20  /usr/local/sbin/httpd'];

var filesContent = {
  '/boot/shutdown' : [
  		'%c(@lightgrey)Waiting (max 60 seconds) for system process \'crypto\' to stop...done',
  		'%c(@lightgrey)Waiting (max 60 seconds) for system process \'vnlru\' to stop...done',
  		'%c(@lightgrey)Waiting (max 60 seconds) for system process \'bufdaemon\' to stop...done',
  		'%c(@lightgrey)Waiting (max 60 seconds) for system process \'syncer\' to stop...',
  		'%c(@lightgrey)Syncing disks, vnodes remaining...5 6 7 3 2 1 1 1 0 0 0 done',
  		'', '', '', '%c(@lightgrey)All buffers synced.',
  		'%c(@lightgrey)Uptime: 14d13h29m45s', '',
  		'%c(@lightgrey)Rebooting...%n', '', '', ''],
  '/boot/kernel' : [
      'OpenBSD 4.0 (GENERIC) #0: Sun Mar 11 03:46:57 CDT 2007',
      '    samble@brunner.silenceisdefeat.org:/usr/src/sys/arch/i386/compile/GENERIC',
      'cpu0: Intel(R) Pentium(R) 4 CPU 2.00GHz ("GenuineIntel" 686-class) 2 GHz',
      'cpu0: FPU,V86,DE,PSE,TSC,MSR,PAE,MCE,CX8,APIC,SEP,MTRR,PGE,MCA,CMOV,PAT,PSE36,CFLUSH,DS,ACPI,MMX,FXSR,SSE,SSE2,SS,HTT,TM',
      'real mem  = 1064927232 (1039968K)',
      'avail mem = 963403776 (940824K)',
      'using 4256 buffers containing 53350400 bytes (52100K) of memory',
      'mainbus0 (root)',
      'bios0 at mainbus0: AT/286+(55) BIOS, date 09/22/03, BIOS32 rev. 0 @ 0xfb2f0, SMBIOS rev. 2.3 @ 0xf0800 (40 entries)',
      'bios0: Supermicro P4SPA',
      'pcibios0 at bios0: rev 2.1 @ 0xf0000/0xd824',
      'pcibios0: PCI IRQ Routing Table rev 1.0 @ 0xfd730/208 (11 entries)',
      'pcibios0: PCI Exclusive IRQs: 5 9 10 11 12',
      'pcibios0: PCI Interrupt Router at 000:31:0 ("Intel 82371SB ISA" rev 0x00)',
      'pcibios0: PCI bus #2 is the last bus',
      'bios0: ROM list: 0xc0000/0xa200! 0xcc000/0x1800 0xef000/0x1000!',
      'cpu0 at mainbus0',
      'pci0 at mainbus0 bus 0: configuration mode 1 (no bios)',
      'pchb0 at pci0 dev 0 function 0 "Intel 82865G/PE/P CPU-I/0-1" rev 0x02',
      'vga1 at pci0 dev 2 function 0 "Intel 82865G Video" rev 0x02: aperture at 0xf0000000, size 0x8000000',
      'wsdisplay0 at vga1 mux 1: console (80x25, vt100 emulation)',
      'wsdisplay0: screen 1-5 added (80x25, vt100 emulation)',
      'ppb0 at pci0 dev 3 function 0 "Intel 82865G/PE/P CPU-CSA" rev 0x02',
      'pci1 at ppb0 bus 1',
      'em0 at pci1 dev 1 function 0 "Intel PRO/1000CT (82547EI)" rev 0x00: irq 11, address 00:30:48:54:39:ab',
      'ppb1 at pci0 dev 30 function 0 "Intel 82801BA AGP" rev 0xc2',
      'pci2 at ppb1 bus 2',
      'ichpcib0 at pci0 dev 31 function 0 "Intel 82801EB/ER LPC" rev 0x02',
      'pciide0 at pci0 dev 31 function 1 "Intel 82801EB/ER IDE" rev 0x02: DMA, channel 0 configured to compatibility, channel 1 configured to compatibility',
      'wd0 at pciide0 channel 0 drive 0: <WDC WD400BB-22JHC0>',
      'wd0: 16-sector PIO, LBA, 38165MB, 78163247 sectors',
      'wd0(pciide0:0:0): using PIO mode 4, Ultra-DMA mode 5',
      'wd1 at pciide0 channel 1 drive 0: <ST340014A>',
      'wd1: 16-sector PIO, LBA48, 38166MB, 78165360 sectors',
      'wd1(pciide0:1:0): using PIO mode 4, Ultra-DMA mode 5',
      'pciide1 at pci0 dev 31 function 2 "Intel 82801EB SATA" rev 0x02: DMA, channel 0 configured to native-PCI, channel 1 configured to native-PCI',
      'pciide1: using irq 11 for native-PCI interrupt',
      'ichiic0 at pci0 dev 31 function 3 "Intel 82801EB/ER SMBus" rev 0x02: irq 9 iic0 at ichiic0',
      'isa0 at ichpcib0',
      'isadma0 at isa0',
      'pckbc0 at isa0 port 0x60/5',
      'pckbd0 at pckbc0 (kbd slot)',
      'pckbc0: using irq 1 for kbd slot',
      'wskbd0 at pckbd0: console keyboard, using wsdisplay0',
      'pcppi0 at isa0 port 0x61',
      'midi0 at pcppi0: <PC speaker>',
      'spkr0 at pcppi0',
      'lpt0 at isa0 port 0x378/4 irq 7',
      'lm0 at isa0 port 0x290/8: W83627HF',
      'npx0 at isa0 port 0xf0/16: using exception 16',
      'pccom0 at isa0 port 0x3f8/8 irq 4: ns16550a, 16 byte fifo',
      'pccom1 at isa0 port 0x2f8/8 irq 3: ns16550a, 16 byte fifo',
      'fdc0 at isa0 port 0x3f0/6 irq 6 drq 2',
      'biomask ff65 netmask ff65 ttymask ffe7',
      'pctr: user-level cycle counter enabled',
      'dkcsum: wd0 matches BIOS drive 0x80',
      'dkcsum: wd1 matches BIOS drive 0x81',
      'root on wd0a',
      'rootdev=0x0 rrootdev=0x300 rawdev=0x302',
  		'%c(@lightgrey)Trying to mount root from ufs:/dev/ad0a', '',
  		'%c(@lightgrey)/bin/sh: accessing tty1', '', 'ready', ' '],
  '/home/www/greco.txt' : [

  ]
}
    
var client = {
  ip          : 'N/A',
  city        : 'N/A',
  countryCode : 'N/A',
  countryName : 'N/A',
  location    : 'N/A'
}
var host = {
  ip : '78.31.70.238'
}




