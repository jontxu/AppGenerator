#!/bin/sh
#
# Shell script that creates an app
# This version is only a test

folder="gen/$2"

mv/gen/main/ $folder
sed -e s/com.deustotech.eventapp/eu.deustotech."$1"/g $folder/src/eu/deustotech/eventapp/EventAppActivity.java > $folder/src/eu/deustotech/eventapp/NewEventAppActivity.java
rm $folder/src/eu/deustotech/eventapp/EventAppActivity.java
mv $folder/src/eu/deustotech/eventapp/NewEventAppActivity.java $folder/src/eu/deustotech/eventapp/EventAppActivity.java
sed -e s/com.deustotech.eventapp/eu.deustotech."$1"/g $folder/AndroidManifest.xml > $folder/NewAndroidManifest.xml
rm $folder/AndroidManifest.xml
mv $folder/NewAndroidManifest.xml $folder/AndroidManifest.xml
case "$1" in 
        "a")
		#twitter
		echo "a"
		
		mv gen/skeleton/assets/www/js/core/twitter/ $folder/assets/www/js/core
                mv gen/skeleton/assets/www/js/core/twitter/ $folder/assets/www/js/core
                mv gen/twitter/assets/www/event.html $folder/assets/www/js/core

                ;;
        "b")
		#facebook
		mv skeleton/assets/www/js/facebook/* gen/$2/assets/js/www/core
                mv skeleton/src/com/facebook/android/* gen/$2/src/com/facebook/android/s
                mv gen/twitter/assets/www/event.html $folder/assets/www/js/core
                echo "b"
                ;;
        "c")
		#both
		mv skeleton/both/* gen/$2
                echo "c"
                ;;
        *)
        echo "Usage: script.sh [a | b | c]"
        exit
        ;;
esac
cd $folder
ant release