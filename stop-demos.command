#!/bin/bash
# Stop all local demo servers. Double-click, or run from Terminal.
if pkill -f "local-serve.js" >/dev/null 2>&1; then
  echo "Stopped the local demo servers."
else
  echo "No local demo servers were running."
fi
sleep 1
# Auto-close this window after a moment (double-click case).
osascript -e 'tell application "Terminal" to close (every window whose name contains "stop-demos")' >/dev/null 2>&1 &
