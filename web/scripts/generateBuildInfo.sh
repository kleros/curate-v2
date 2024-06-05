#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

jq -n --arg primeUri "$DEPLOY_PRIME_URL" --arg uri "$URL" --arg deployUri "$DEPLOY_URL" '{ netlifyDeployPrimeUri: $primeUri, netlifyUri: $uri, netlifyDeployUri: $deployUri }' > src/generatedNetlifyInfo.json


# Fetch main curate address from subgraph
if [ -z "$REACT_APP_ARBSEPOLIA_SUBGRAPH" ]; then
  echo "Error: REACT_APP_ARBSEPOLIA_SUBGRAPH environment variable is not set."
  exit 1
fi

QUERY='{"query":"{\n    mainCurate(id:\"0\"){\n        address\n    }\n}","variables":{}}'

OUTPUT_FILE="src/generatedMainCurateAddress.json"

TEMP_FILE=$(mktemp)

if curl "$REACT_APP_ARBSEPOLIA_SUBGRAPH" -s -X POST -H "Content-Type: application/json" --data "$QUERY"  -o "$TEMP_FILE"; then
  ADDRESS=$(jq -r '.data.mainCurate.address' "$TEMP_FILE")
  echo "{\"mainCurateAddress\": \"$ADDRESS\"}" > "$OUTPUT_FILE"

  echo -e "✔ Main Curate address fetched and saved to $OUTPUT_FILE"
else
  echo -e "❌ Error fetching Main curate address from $REACT_APP_ARBSEPOLIA_SUBGRAPH"
  exit 1
fi

rm "$TEMP_FILE"

node "$SCRIPT_DIR/gitInfo.js"