#!/bin/bash

echo "Nederlandse Spraak App - Build Script"
echo "====================================="

echo "Installeren van dependencies..."
npm install

echo "Controleren van bestanden..."
if [ ! -f "main.js" ]; then
    echo "Fout: main.js niet gevonden!"
    exit 1
fi

if [ ! -f "index.html" ]; then
    echo "Fout: index.html niet gevonden!"
    exit 1
fi

if [ ! -f "renderer.js" ]; then
    echo "Fout: renderer.js niet gevonden!"
    exit 1
fi

if [ ! -f "style.css" ]; then
    echo "Fout: style.css niet gevonden!"
    exit 1
fi

if [ ! -d "media" ]; then
    echo "Fout: media directory niet gevonden!"
    exit 1
fi

echo "Alle bestanden gevonden!"

echo "Starten van de applicatie..."
npm start

