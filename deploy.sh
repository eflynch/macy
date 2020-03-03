#!/bin/bash
cd macyclient
npm install
npm run release
cd ..
cp -r macyclient/app/* docs/

