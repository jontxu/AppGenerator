#!/bin/sh
#
# Shell script that creates an app

# Variables for the folders involved for the app generation
set -e
folder="gen/$1"
skeleton="gen/skeleton"
tw="gen/twitter"
fb="gen/facebook"
main="gen/main"
twfb="gen/twfb"
twev="gen/tewv"
fbev="gen/fbev"
adt="../adt/sdk/tools"
current="../../../AppGenerator"

cd $adt
./android --verbose create project --target 12 --name $2 --path $current/gen/$1 --activity $2Activity --package eu.deustotech.$1
cd $current
mv $main $folder
sed -e s/com.deustotech.eventapp/eu.deustotech."$1"/g $folder/src/eu/deustotech/eventapp/EventAppActivity.java > $folder/src/eu/deustotech/eventapp/NewEventAppActivity.java
rm $folder/src/eu/deustotech/eventapp/EventAppActivity.java
mv $folder/src/eu/deustotech/eventapp/NewEventAppActivity.java $folder/src/eu/deustotech/eventapp/EventAppActivity.java
sed -e s/com.deustotech.eventapp/eu.deustotech."$1"/g $folder/AndroidManifest.xml > $folder/NewAndroidManifest.xml
rm $folder/AndroidManifest.xml
mv $folder/NewAndroidManifest.xml $folder/AndroidManifest.xml
mv $skeleton/assets/www/js/ $folder/assets/www/js/core #cordova, childbrowser, jquery, jquery mobile, etc
mv $skeleton/assets/www/js/events.js $folder/assets/www/js/
mv $skeleton/assets/www/js/media.js $folder/assets/www/js/
case "$3" in 
        "twitter")
		#twitter
		echo "a"
		mv $skeleton/assets/www/js/core/twitter/jsOAuth-1.3.6.min.js $folder/assets/www/js/core
                mv $skeleton/assets/www/js/core/twitter/twitter.js $folder/assets/www/js/
                mv gen/twitter/assets/www/event.html $folder/assets/www/js/core
                ;;
        "facebook")
		#facebook
		mv $skeleton/assets/www/js/facebook/cdv-plugin-facebook-connect.js $folder/assets/js/www/core
                mv $skeleton/assets/www/js/facebook_js_sdk.js $folder/assets/www/js/core
                mv $skeleton/assets/www/js/social.js $folder/assets/www/js/
                mv $skeleton/src/com/facebook/android/* $folder/src/com/facebook/android/
                mv gen/facebook/assets/www/event.html $folder/assets/www/js/core
                echo "b"
                ;;
        "evernote")
		#evernote
		mv $skeleton/assets/www/js/core/evernote $folder/assets/www/js/core/evernote
                mv $skeleton/assets/www/js/evernote.js $folder/assets/www/js
                echo "c"
                ;;
        *)
        exit
        ;;
esac
echo "Building app..."
cd $folder
ant debug
exit