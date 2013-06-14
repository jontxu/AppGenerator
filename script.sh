#!/bin/sh
#
# Shell script that creates an app

# Variables for the folders involved for the app generation
adt="../adt-bundle-linux-x86_64-20130219/sdk/tools"
current="../../../AppGenerator"

echo "Beginning"
cd $adt
./android create project --target 12 --name $2 --path $current/gen/$1 --activity $2Activity --package eu.deustotech.$1
echo "App has been built"
cd $current