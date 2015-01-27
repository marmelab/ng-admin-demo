#!/bin/sh

git checkout db.json
json-server db.json --port 8000
