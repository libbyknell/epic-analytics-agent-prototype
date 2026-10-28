#!/bin/bash
# One-time setup on a demo laptop. Double-click AFTER copying the project here.
# Puts "Start Demos" and "Stop Demos" launchers on the Desktop, each pointing
# back at this project, so you never have to dig into folders again.
set -e
BASE="$(cd "$(dirname "$0")" && pwd)"   # absolute path to the folder holding local-serve.js
DESKTOP="$HOME/Desktop"

if ! command -v node >/dev/null 2>&1; then
  echo "⚠  Node.js is not installed on this laptop."
  echo "   Install the LTS build from https://nodejs.org first, then run this again."
  echo "   (The demos need Node to serve. Nothing else is required — no npm install.)"
  read -n 1 -s -r -p "Press any key to close."
  exit 1
fi

# --- Desktop START launcher (absolute path baked in) ---
cat > "$DESKTOP/Start Demos.command" <<EOF
#!/bin/bash
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Get it from https://nodejs.org and re-run."
  read -n 1 -s -r -p "Press any key to close."; exit 1
fi
pkill -f "local-serve.js" >/dev/null 2>&1; sleep 1
echo "Starting demos… (keep this window open)"
exec node "$BASE/local-serve.js"
EOF

# --- Desktop STOP launcher ---
cat > "$DESKTOP/Stop Demos.command" <<'EOF'
#!/bin/bash
if pkill -f "local-serve.js" >/dev/null 2>&1; then
  echo "Stopped the local demo servers."
else
  echo "No local demo servers were running."
fi
sleep 1
osascript -e 'tell application "Terminal" to close (every window whose name contains "Stop Demos")' >/dev/null 2>&1 &
EOF

chmod +x "$DESKTOP/Start Demos.command" "$DESKTOP/Stop Demos.command"

echo "✓ Installed two launchers on your Desktop:"
echo "    • Start Demos   — boots the apps, drops a URL sheet + Chrome bookmarks file"
echo "    • Stop Demos    — shuts every app down"
echo
echo "Next: double-click “Start Demos”. First time only, macOS may warn about an"
echo "app from an unidentified developer — right-click ▸ Open ▸ Open."
echo
read -n 1 -s -r -p "Press any key to close."
