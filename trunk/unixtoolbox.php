<html>
<head>
  <style type="text/css" >
/* basic CSS common to all media */
html {
    margin: 0;
}
body {
    padding: 0;
    font-family: verdana, arial, sans-serif;
    font-size: 90%;
    counter-reset: chapter section;
}
div.title {
    text-transform: uppercase;
    padding: 1em 0;
    text-align: center;
    font-size: 220%;
    font-weight: bold;
    letter-spacing: .22em;
}
h1, h2, h3 div.title {
    font-family: verdana, sans-serif;
}
h1 {
    text-transform: uppercase;
    font-size: 150%;
    letter-spacing: .15em;
    counter-reset: section;
    string-set: chaptertitle content();
}
h2 {
    font-size: 120%;
    letter-spacing: .10em;
}
h3, h4 {
    font-size: 100%;
    line-height:1em;
    letter-spacing: .07em;
}
h4 {
    font-style: italic;
    font-weight: normal;
    margin: 1em 0 0.5em 0;
}
pre {
    padding: 0.1em 0em 0.1em 1em;
}
div.menu a {
    font-weight: normal;
    text-decoration: none;
}
h1:before {
    content: counter(chapter) " ";
    counter-increment: chapter;
}
h2:before {
    counter-increment: section;
    content: counter(chapter) "." counter(section) " ";
}
/* Not implemented in browsers yet */
a.xref:after { 
    content: " " target-counter(attr(href, url), chapter) "."
    target-counter(attr(href, url), section); 
}
div.changestyle {
    padding-top: 1em;
}

@media screen, handheld {
/* Menu on the right for screen media */
/* including some IE6 hacks */
    body {
        padding: 0;
        margin: 1em 13em 0em 2em;
    }	
    html>body {
        margin: 1em 13em 0em 2em;
    }
    body>div.menu {
        /* position: fixed; */
    }
    body>div.changestyle {
        /* position: fixed; */
    }
    div.menu { 
        position: absolute;
        z-index: 2;
        width: 10.2em; height: auto;
        top: 0.4em; right: 1em; bottom: 0.8em; left: auto;
    }
    div.changestyle {
        font-size: 80%;
        font-weight: normal;
        /* position: absolute; */
        z-index: 2;
        width: 10.2em; height: auto;
        bottom: 0;
    }
    ol.toc, ol.toc li  {
        margin: 0;
        list-style-type: none;
        padding: 0.13em 0;
        text-indent: 0;
        text-align: left;
    }
    p.last {
        padding-top: 5em;
    }
    .fn {
        display: none;
        counter-increment: footnote
    }
}

@media print {
/* layout */
/* Menu as TOC for print */
    body {
        font-size: 88%;
    }	
    div.title {
        padding: 0.5em 0 2em 0;
    }
    div {
        text-align: justify;
    }
    
    h3 {
        margin-bottom: 1em;
    }
    pre {
        font-size: 90%;
        margin: 0.4em 0;
        padding: 0.2em 0 0.2em 0.4em;
        text-align: left;
    }
    a {
	text-decoration: none;
    }
    p.xrefp {  /* links below h1 headers */
        padding-top: 0;
        margin: -0.9em 0 1.3em 0;
        page-break-inside: avoid;
        page-break-after: avoid;
    }
    a.xrefp {
        font-weight: normal;
        text-decoration: none;
    }
    ol.toc li  {
        list-style-type: decimal;
        margin: 0;
        padding: 0.25em 0;
    }
    ol.toc  {
        margin: 0 0 0 2.2em;
        list-style-position: outside;
        font-weight: normal;
        list-style-type: decimal;
        padding: 4em 0;
    }
    ol.toc a::after {
        content: leader(' . ') target-counter(attr(href), page);
    }
/*
a.xref:after { 
    content: " [" target-counter(attr(href, url), chapter) "."
    target-counter(attr(href, url), section) " page " 
    target-counter(attr(href, url), page) "]"; 
}
*/
    a.xref:after { 
        content: " (page " target-counter(attr(href, url), page) ")"; 
    }
    a.xrefp:after { 
        content: " (p"target-counter(attr(href, url), page)")"; 
    }
    h1, h2, h3, h4, h5 { 
        page-break-after: avoid;
    }
    div.footerfirst, div.footerlast {
        position: absolute;
        bottom: 0;
    }
    div.main {
        page-break-before: always;
    }
    div.pb {
        page-break-after: always;
    }
    div.changestyle, p.copyright, span.web {
        display: none;
    }
    div#sysinfo {
        margin-top: -1.5em;
    }
    p.last {
        padding-top: 2em;
    }
    .fn {
        display: prince-footnote;
        counter-increment: footnote;
        font-size: 80%;
    }
    .fn::footnote-call {
        content: counter(footnote);
        font-size: 80%;
        vertical-align: super;
        line-height: none
    }
    .fn::footnote-marker {
        list-style-position: inside;
    }
}
@page {
    size: A4 portrait;
    margin: 16mm 14mm 14mm 12mm;
    padding: 0mm 0 5mm 0;
    @footnotes {
	border-top: solid #000040 thin;
	padding-top: 0.22em;
        padding-left: 1.2em;
        font-family: verdana, sans-serif;
    }
    @bottom-center {
        padding: 0 0 5mm 0;
        content: counter(page);
        font-family: verdana, sans-serif;
        font-size: 88%;
    }
    @top {
        padding-top: 5mm;
	content: "&#8212; " string(chaptertitle) " &#8212;";
        font-family: verdana, sans-serif;
    }
}
@page :first {
    padding: 0;
    @bottom-center {
        content: normal;
    }
    @top {
        content: normal;
    }
}

@media screen, handheld, print {
/* Colors only */
html {
    background-color: white;
    color: black;
}
h1 {
    background-color: #000040;
    color: white;
}
h3, h4, div.title, h2, a:link, a:visited, .cmt {
    background-color: transparent;
    color: #000040;
}
pre {
    background-color: #F6F6FC;
}
pre, code { 
    color: #003300;
}
a:hover, .pp {
    color: #D55500;
}
a:active {
    color: green;
}
.keyword {
    color:#0000FF;
}
}
@media print {
/* print only colors */
pre, code { 
    color: #000;
}
a:link, a:visited, .cmt {
    background-color: transparent;
    color: #000060;
}
}

@media screen, handheld {
/* Colors only */
html {
    background-color: black;
    color: Gainsboro;
}
h1 {
    background-color: #ffffcd;
    color: black;
}
h3, h4, div.title, h2, a:link, a:visited, .cmt {
    background-color: transparent;
    color: #ffffcd;
}
pre {
    background-color: #090903;
}
pre, code { 
    color: #ffc3ff;
}
a:hover, .pp {
    color: #2aaaff;
}
a:active {
    color: orange;
}
.keyword {
    color:#ff0000;
}
}
</style>
</head>
<body>
<?php
header('Content-Type:   text/html;   charset=utf-8');
$dom = new DOMDocument('1.0', 'UTF-8');
$dom->substituteEntities = true;
$dom->load('unixtoolbox_zh_CN.xhtml');
$xp = new DomXPath($dom);
$xp->registerNamespace('xhtml','http://www.w3.org/1999/xhtml');

// Print the revision number
$subject = $xp->query("//xhtml:meta[@name='subject']");
$copyright = $xp->query("//xhtml:meta[@name='copyright']");
echo $subject->item(0)->getAttribute("content") . "<br />\n";
echo $copyright->item(0)->getAttribute("content") . "<br />\n";

// Get all h1 header from the TOC
$headers = $xp->query("//xhtml:ol/xhtml:li/xhtml:a"); // res ist a nodeList

foreach ($headers as $header) {
    $attr = $header->getAttribute("href");
    $link = str_replace("#","?href=",$attr);
    echo "<a href=\"" . $link . "\">" . $header->nodeValue . "</a><br />\n";
}

// Display the div content as simple XML node
$href = $_GET["href"];
if ($href) {
    $h1 = $xp->query("//xhtml:div[@id='$href']");
    $div = $h1->item(0)->ownerDocument->saveXML($h1->item(0));
    //echo utf8_decode($div);   // Aaaargh
    echo $div;
}

?>
</body>
</html>