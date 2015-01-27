#!/bin/sh

git checkout db.json
json-server db.json -p 8000
