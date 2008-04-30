<?php
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
    echo utf8_decode($div);   // Aaaargh
}

?>
