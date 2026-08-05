#!/bin/bash

read -p "Enter a filename to check: " FILE

if [ -f "$FILE" ]; then
    echo "Yep, the file '$FILE' is right here!"
else
    echo "Nope, the file '$FILE' does not exist."
fi
