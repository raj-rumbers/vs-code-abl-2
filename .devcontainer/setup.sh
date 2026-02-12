#!/bin/bash

# neo Demo Setup Script
# This script checks for and installs neo Demo

set -e

# Copy .bashrc to home directory if it exists
if [ -f "${PWD}/.devcontainer/.bashrc" ]; then
    echo "→ Copying .bashrc to home directory..."
    cp "${PWD}/.devcontainer/.bashrc" ~/.bashrc
    echo "✓ .bashrc configured"
fi