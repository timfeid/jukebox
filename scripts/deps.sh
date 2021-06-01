#!/bin/sh

rm -f -r .deps  # optional, to be sure that there is
# no extraneous "package.json" from a previous build

# there should be no package.json from node_modules included in the deps (in a CI build there are none)
find . -type d \( -path \*/.deps  -o -path \*/node_modules \) -prune -o \
  -type f \( -name "package.json" \) \
  -exec sh -c 'dest=".deps/$1" && \
    mkdir -p -- "$(dirname "$dest")" && \
    cp -av -- "$1" "$dest"' sh '{}' \;
