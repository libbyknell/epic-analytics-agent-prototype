#!/bin/bash
# Start the demo prototype(s) locally. Double-click, or run from Terminal.
# (Run "Install to Desktop.command" once to get Start/Stop icons on the Desktop.)
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed."
  echo "Install the LTS build from https://nodejs.org and run this again."
  read -n 1 -s -r -p "Press any key to close."
  exit 1
fi

# If a previous run is still going, clear it first so ports are free.
pkill -f "local-serve.js" >/dev/null 2>&1
sleep 1

echo "Starting demos… (keep this window open)"
exec node "$(dirname "$0")/local-serve.js"
