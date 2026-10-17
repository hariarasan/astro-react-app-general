#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# Regenerates this project's Android (and iOS) *native* scaffolding
# (gradlew + wrapper jar, settings.gradle, MainActivity.kt,
# MainApplication.kt, launcher icons, metro.config.js, .watchmanconfig)
# from scratch using the official React Native CLI, then re-applies this
# project's customizations on top:
#   - the JS component name + display name FROM app.json (so the native
#     side always matches whatever app.json currently says - this is what
#     avoids the "<name> has not been registered" crash after a rename)
#   - android:usesCleartextTraffic="true" (talks to a local HTTP dev API)
#   - react-native-config's Android gradle wiring (reads .env -> Config.*)
#
# Use this if android/ (or ios/) ever gets corrupted, if you bump the React
# Native version and want a clean matching-version native project, or if a
# native dependency's install step asks you to "regenerate the native
# project". It does NOT touch src/, App.tsx, index.js, babel.config.js,
# jest config, or .env - only android/, ios/, metro.config.js,
# .watchmanconfig, and (merged, not replaced) package.json.
#
# IMPORTANT: if you rename the app, edit app.json FIRST (both "name" - the
# JS component registration key, no spaces - and "displayName" - the
# human-readable launcher label), then run this script so the native side
# picks up the new name. Editing app.json alone does NOT rename the native
# Android project; this script is what propagates it.
#
# Run this from *inside* astro-react-app/:
#   bash scripts/regenerate-native-scaffold.sh
# ---------------------------------------------------------------------------

# Some sandboxed/proxied environments need Node's undici fetch to respect
# HTTPS_PROXY/HTTP_PROXY explicitly; harmless no-op when no proxy is set.
export NODE_USE_ENV_PROXY=1

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="$(mktemp -d)"
PACKAGE_NAME="com.astrovedicapp"
RN_VERSION="0.87.1"

# Read the current JS component name / display name from app.json, so the
# regenerated native project always matches - no matter how many times the
# app gets renamed later.
JS_COMPONENT_NAME="$(node -p "require('$PROJECT_DIR/app.json').name")"
DISPLAY_NAME="$(node -p "require('$PROJECT_DIR/app.json').displayName")"
# The CLI template's own internal name (only used for scratch generation -
# unrelated to the app's real package/component name, which we patch in
# below regardless of what this is).
TEMPLATE_NAME="NativeScaffoldTemplate"

echo "Project dir: $PROJECT_DIR"
echo "Scratch dir: $WORK_DIR"
echo "JS component name (from app.json): $JS_COMPONENT_NAME"
echo "Display name (from app.json): $DISPLAY_NAME"

cd "$WORK_DIR"
npx --yes @react-native-community/cli@latest init "$TEMPLATE_NAME" \
  --version "$RN_VERSION" \
  --package-name "$PACKAGE_NAME" \
  --skip-install \
  --pm npm \
  --skip-git-init

GEN_DIR="$WORK_DIR/$TEMPLATE_NAME"

echo "== Replacing android/ and ios/ with freshly generated scaffolding =="
rm -rf "$PROJECT_DIR/android.generated" "$PROJECT_DIR/ios.generated"
cp -R "$GEN_DIR/android" "$PROJECT_DIR/android.generated"
cp -R "$GEN_DIR/ios" "$PROJECT_DIR/ios.generated"
cp "$GEN_DIR/metro.config.js" "$PROJECT_DIR/metro.config.js"
cp "$GEN_DIR/.watchmanconfig" "$PROJECT_DIR/.watchmanconfig"

rm -rf "$PROJECT_DIR/android"
mv "$PROJECT_DIR/android.generated" "$PROJECT_DIR/android"
rm -rf "$PROJECT_DIR/ios"
mv "$PROJECT_DIR/ios.generated" "$PROJECT_DIR/ios"

echo "== Setting JS component name (MainActivity.getMainComponentName) =="
MAIN_ACTIVITY="$(find "$PROJECT_DIR/android" -iname "MainActivity.kt")"
sed -i.bak \
  -E "s/getMainComponentName\(\): String = \"[^\"]*\"/getMainComponentName(): String = \"$JS_COMPONENT_NAME\"/" \
  "$MAIN_ACTIVITY"
rm -f "$MAIN_ACTIVITY.bak"

echo "== Setting launcher display name =="
STRINGS_XML="$PROJECT_DIR/android/app/src/main/res/values/strings.xml"
sed -i.bak \
  -E "s#<string name=\"app_name\">.*</string>#<string name=\"app_name\">$DISPLAY_NAME</string>#" \
  "$STRINGS_XML"
rm -f "$STRINGS_XML.bak"

echo "== Re-applying cleartext HTTP override (local dev API over plain http) =="
MANIFEST="$PROJECT_DIR/android/app/src/main/AndroidManifest.xml"
sed -i.bak \
  -e 's/android:usesCleartextTraffic="\${usesCleartextTraffic}"/android:usesCleartextTraffic="true"/' \
  "$MANIFEST"
rm -f "$MANIFEST.bak"

echo "== Re-applying react-native-config Android gradle wiring =="
APP_BUILD_GRADLE="$PROJECT_DIR/android/app/build.gradle"
if ! grep -q "react-native-config" "$APP_BUILD_GRADLE"; then
  python3 - "$APP_BUILD_GRADLE" <<'PYEOF'
import sys
path = sys.argv[1]
with open(path) as f:
    lines = f.readlines()
# Insert right after the last top-level `apply plugin:` line.
insert_at = 0
for i, line in enumerate(lines):
    if line.startswith("apply plugin:"):
        insert_at = i + 1
lines.insert(
    insert_at,
    'apply from: project(":react-native-config").projectDir.getPath() + "/dotenv.gradle"\n',
)
with open(path, "w") as f:
    f.writelines(lines)
print("react-native-config gradle line inserted at", insert_at)
PYEOF
else
  echo "   (already present, skipping)"
fi

echo "== Merging package.json dependencies =="
node - "$PROJECT_DIR/package.json" "$GEN_DIR/package.json" <<'NODEEOF'
const fs = require('fs');
const [, , oursPath, genPath] = process.argv;
const ours = JSON.parse(fs.readFileSync(oursPath, 'utf8'));
const gen = JSON.parse(fs.readFileSync(genPath, 'utf8'));

// Generated template's react/react-native versions win (matched to the CLI
// version we just generated with) - our extra deps merge in on top of that.
// Our own scripts win over the template's. Never take the template's
// "name" field - that's the scratch template name, not this app's.
const { name: _templateName, ...genRest } = gen;
const merged = {
  ...ours,
  scripts: { ...genRest.scripts, ...ours.scripts },
  dependencies: { ...ours.dependencies, ...genRest.dependencies },
  devDependencies: { ...ours.devDependencies, ...genRest.devDependencies },
};
fs.writeFileSync(oursPath, JSON.stringify(merged, null, 2) + '\n');
console.log('package.json merged');
NODEEOF

echo ""
echo "Done. Next steps:"
echo "  cd \"$PROJECT_DIR\""
echo "  npm install"
echo "  cd ios && pod install && cd ..   # only if you build for iOS"
echo "  npx react-native run-android"
