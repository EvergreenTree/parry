#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f "pioneer_token.txt" ]]; then
  echo "pioneer_token.txt not found at repo root." >&2
  exit 1
fi

mkdir -p Config
TOKEN=$(tr -d '\r\n ' < "pioneer_token.txt")
{
  echo "// Auto-generated from pioneer_token.txt"
  echo "PIONEER_API_KEY = ${TOKEN}"
} > Config/Config.xcconfig

echo "Wrote Config/Config.xcconfig"
