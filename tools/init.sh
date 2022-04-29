#!/bin/bash

APP_PATH="$1"
APP_NAME="$(basename "$APP_PATH")"
TYPE="$2"
ROOT_DIR="dist"

cd "$APP_PATH" || exit 1

mkdir -p "$ROOT_DIR"

clasp create --title "$APP_NAME" --type "$TYPE" --rootDir "$ROOT_DIR"

mv $ROOT_DIR/.clasp.json .
mv $ROOT_DIR/appsscript.json .
