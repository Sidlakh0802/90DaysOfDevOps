#!/bin/bash

SERVICE="ssh"

read -p "Do you want to check the status of $SERVICE? (y/n): " CHOICE

if [ "$CHOICE" == "y" ]; then
    echo "Checking status of $SERVICE..."
    systemctl status "$SERVICE"
elif [ "$CHOICE" == "n" ]; then
    echo "Okay, skipped."
else
    echo "I didn't understand that. Please enter 'y' or 'n'."
fi
