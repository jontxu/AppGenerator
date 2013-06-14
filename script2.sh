#!/bin/sh
#
# Shell script that creates an app

# Variables for the folders involved for the app generation
folder="gen/$1"
skeleton="gen/skeleton"
tw="gen/twitter"
fb="gen/facebook"
ev="gen/evernote"
main="gen/main"
twfb="gen/twfb"
twev="gen/twev"
fbev="gen/fbev"
adt="../adt-bundle-linux-x86_64-20130219/sdk/tools"
current="../../../AppGenerator"

echo "Beginning..."
cp -r $skeleton/* $folder
cp gen/activityfile/EventAppActivity.java $folder/src/eu/deustotech/$1/$2Activity.java
sed -e s/com.deustotech.eventapp/eu.deustotech."$1"/g $folder/src/eu/deustotech/$1/$2Activity.java > $folder/src/eu/deustotech/$1/$2ActivityNew.java
sed -e s/EventApp/"$2"/g $folder/src/eu/deustotech/$1/$2ActivityNew.java > $folder/src/eu/deustotech/$1/$2ActivityNew2.java
mv $folder/src/eu/deustotech/$1/$2ActivityNew2.java $folder/src/eu/deustotech/$1/$2Activity.java
rm $folder/src/eu/deustotech/$1/$2ActivityNew.java
sed -e s/com.deustotech.eventapp/eu.deustotech."$1"/g $folder/AndroidManifest.xml > $folder/NewAndroidManifest.xml
rm $folder/AndroidManifest.xml
mv $folder/NewAndroidManifest.xml $folder/AndroidManifest.xml
cp $folder/assets/events.html $folder/assets/www/
cp $folder/assets/eventapp.min.css $folder/assets/www/css

if [ $3 ]; then
        #twitter
        echo "Your app uses twitter"
        cp $tw/jsOAuth-1.3.6.min.js $folder/assets/www/js/core/
        cp $tw/twitter.js $folder/assets/www/js/
        cp $tw/jquery.limit.js $folder/assets/www/js/
fi
if [ $4 ]; then
        #facebook
        echo "Your app uses facebook"
        cp $fb/cdv-plugin-fb-connect.js $folder/assets/www/js/core/
        cp $fb/facebook_js_sdk.js $folder/assets/www/js/core/
        cp $fb/social.js $folder/assets/www/js/
        cp -r $fb/facebook/ $folder/src/com/
        sed -e s/com.deustotech.eventapp/eu.deustotech."$1"/g $folder/src/com/facebook/android/FbDialog.java > $folder/src/com/facebook/android/FbDialogNew.java
        mv $folder/src/com/facebook/android/FbDialogNew.java $folder/src/com/facebook/android/FbDialog.java
        #cp -r $fb/fb/* $folder/assets/www
fi
if [ $5 ]; then
        #evernote
        echo "Your app uses evernote"
        cp $ev/jsOAuth-1.3.6.min.js $folder/assets/www/js/core/
        cp $ev/evernote-sdk-minified.js $folder/assets/www/js/core/
        cp $ev/evernote.js $folder/assets/www/js/
fi
#Index file for the choices made.
echo "Updating index file..."
if $3 && !$4 && !$5 ; then
        #Twitter
        cp $tw/index.html $folder/assets/www/
elif !$3 && $4 && !$5 ; then
        #Facebook
        cp $fb/index.html $folder/assets/www/
elif !$3 && !$4 && $5 ; then
        #Evernote
        cp $ev/index.html $folder/assets/www/
elif $3 && $4 && !$5 ; then
        #Facebook + Twitter
        cp $twfb/index.html $folder/assets/www/
elif !$3 && $4 && $5 ; then
        #Facebook + Evernote
        cp $fbev/index.html $folder/assets/www/
elif $3 && !$4 && $5 ; then
        #Evernote + Twitter
        cp $twev/index.html $folder/assets/www/
else
        #All three
        cp $main/index.html $folder/assets/www/
fi
echo "Building app..."
cd $folder
ant debug
exit