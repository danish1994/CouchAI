#!/bin/bash

IFS='-' read -ra VALS <<< "$1"

for i in "${VALS[@]}"; do
    IFS=';' read -ra NAMES <<< $i
    node get_categories.js ${NAMES[0]} "${NAMES[1]}" categories.json
done