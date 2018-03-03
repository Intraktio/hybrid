#!/bin/bash
PATH=$PATH:$(npm bin)
set -x
 
BUILDFOLDER=www/
 
# clean up previous build
rm -fr $BUILDFOLDER
 
# Prod build
export HYBRID_ENV=prod
ionic-app-scripts build --minifyJs --minifyCss --optimizeJs \
# ionic-app-scripts build --prod \
                        --wwwDir $BUILDFOLDER
 
# remove unused css
purifycss $BUILDFOLDER"build/main.css" \
          $BUILDFOLDER"build/*.js" \
          --info \
          --min \
          --out $BUILDFOLDER"build/main.css" \
          #--whitelist .bar-button-default
