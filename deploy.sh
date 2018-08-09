#!/bin/bash
cd macyclient
npm install
npm run build
cd ..
cp -r macyclient/app/* docs/

