#!/bin/bash

# neo Setup Script
# This script checks for and installs the neo

set -e

CONFIG_PATH="/workspaces/neo"
REPO_URL="git@github.com:Progress-AI-Office/neo.git"

echo "==================================="
echo "neo Setup"
echo "==================================="

# Check if the configuration directory already exists
if [ -d "$CONFIG_PATH" ]; then
    echo "✓ neo is already configured at $CONFIG_PATH"
    echo "Nothing to do. Exiting."
    exit 0
fi

echo "→ neo not found. Starting installation..."

# Check if github.com is in known_hosts
echo "→ Checking SSH configuration for github.com..."

# Ensure SSH directory exists with proper permissions
if [ ! -d ~/.ssh ]; then
    echo "→ Creating ~/.ssh directory..."
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
elif [ "$(stat -c %a ~/.ssh)" != "700" ]; then
    echo "→ Fixing permissions for ~/.ssh directory..."
    chmod 700 ~/.ssh
else
    echo "✓ ~/.ssh directory exists with correct permissions"
fi

# Create known_hosts file if it doesn't exist and set permissions only if needed
if [ ! -f ~/.ssh/known_hosts ]; then
    echo "→ Creating ~/.ssh/known_hosts file..."
    touch ~/.ssh/known_hosts
    chmod 644 ~/.ssh/known_hosts
elif [ "$(stat -c %a ~/.ssh/known_hosts)" != "644" ]; then
    echo "→ Fixing permissions for ~/.ssh/known_hosts file..."
    chmod 644 ~/.ssh/known_hosts
else
    echo "✓ ~/.ssh/known_hosts file exists with correct permissions"
fi

if ! ssh-keygen -F github.com >/dev/null 2>&1; then
    echo "→ github.com not found in known_hosts. Adding it now..."

    # Test basic network connectivity using available tools
    echo "→ Testing network connectivity to github.com..."

    # Try to resolve github.com using getent (available in most minimal containers)
    if command -v getent >/dev/null 2>&1; then
        if ! getent hosts github.com >/dev/null 2>&1; then
            echo "⚠️ Warning: DNS resolution failed for github.com"
            echo "  Proceeding anyway - network may still be available"
        else
            echo "✓ DNS resolution successful"
        fi
    else
        echo "→ DNS resolution test skipped (getent not available)"
    fi

    # Test basic connectivity using curl (usually available) or wget as fallback
    if command -v curl >/dev/null 2>&1; then
        if curl -s --connect-timeout 10 --max-time 15 https://github.com >/dev/null 2>&1; then
            echo "✓ Network connectivity to github.com confirmed"
        else
            echo "⚠️ Warning: HTTP connectivity test failed, but SSH might still work"
        fi
    elif command -v wget >/dev/null 2>&1; then
        if wget --quiet --timeout=10 --tries=1 --spider https://github.com 2>/dev/null; then
            echo "✓ Network connectivity to github.com confirmed"
        else
            echo "⚠️ Warning: HTTP connectivity test failed, but SSH might still work"
        fi
    else
        echo "→ Network connectivity test skipped (curl/wget not available)"
    fi

    # Try to get SSH host keys with timeout and better error handling
    echo "→ Retrieving SSH host keys for github.com..."
    if timeout 30 ssh-keyscan -H -t rsa,ed25519 github.com >>~/.ssh/known_hosts 2>/tmp/ssh-keyscan.log; then
        echo "✓ github.com added to known_hosts"
    else
        echo "✗ Error: Failed to add github.com to known_hosts"
        echo "  SSH keyscan output:"
        cat /tmp/ssh-keyscan.log 2>/dev/null || echo "  No error log available"
        echo "  Attempting fallback method..."

        # Fallback: Add known GitHub host keys manually
        cat >>~/.ssh/known_hosts <<'EOF'
github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl
github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=
github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk=
EOF
        echo "✓ Added GitHub host keys using fallback method"
    fi
else
    echo "✓ github.com already in known_hosts"
fi

# Change to /workspaces directory
echo "→ Changing directory to /workspaces..."
cd /workspaces || {
    echo "✗ Error: Failed to change directory to /workspaces"
    exit 1
}

# Clone the repository
echo "→ Cloning neo repository..."
if git clone "$REPO_URL"; then
    echo "✓ Repository cloned successfully"
else
    echo "✗ Error: Failed to clone repository from $REPO_URL"
    echo "  Please ensure you have SSH access configured for GitHub"
    exit 1
fi

# Check if the install script exists
INSTALL_SCRIPT="$CONFIG_PATH/scripts/ghcp-install.sh"
if [ ! -f "$INSTALL_SCRIPT" ]; then
    echo "✗ Error: Install script not found at $INSTALL_SCRIPT"
    exit 1
fi

# Make the install script executable
echo "→ Making install script executable..."
chmod +x "$INSTALL_SCRIPT" || {
    echo "✗ Error: Failed to make install script executable"
    exit 1
}

# Run the installation script
echo "→ Running neo installation script..."
if "$INSTALL_SCRIPT"; then
    echo "✓ neo installation completed successfully"
else
    echo "✗ Error: neo installation script failed"
    exit 1
fi

echo "==================================="
echo "✓ neo setup complete!"
echo "==================================="