#!/bin/sh
if [ $# -ne 1 ]; then
  echo 1>&2 "Usage: $0 HtmlFile"
  exit 1
fi

file=$1
fname=${file%.*} 
fext=${file#*.}

prince $file -o $fname.pdf
pdftops -paper A4 -noshrink $fname.pdf $fname.ps
cat $fname.ps |psbook|psnup -Pa4 -2 |pstops -b "2:0,1U(21cm,29.7cm)" > $fname.book.ps

ps2pdf13 -sPAPERSIZE=a4 -sAutoRotatePages=None $fname.book.ps $fname.book.pdf

exit 0