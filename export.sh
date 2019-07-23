#!/bin/sh
tmpFile=`mktemp /tmp/downloads/temp.XXXXXXX`
wget -q --no-check-certificate $1 -O $tmpFile && rsvg-convert -f png $tmpFile -o $2 -b $3 && rm $tmpFile
echo $2