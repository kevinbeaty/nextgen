PROJECT:=nextgen
NPM_BIN:=$(shell npm bin)

JS_TARGET ?= dist/$(PROJECT)

.PHONY: all clean js test
all: test js

clean:
	rm -rf dist

test: | node_modules
	$(NPM_BIN)/6to5-node $(NPM_BIN)/tape test/*.js

node_modules:
	npm install

build:
	mkdir -p build

dist:
	mkdir -p dist

js: $(JS_TARGET).min.js

build/index.js: index.js | build dist node_modules
	$(NPM_BIN)/6to5 $< -o $@

$(JS_TARGET).js: build/index.js
	$(NPM_BIN)/browserify -s nextgen $< -o $@

$(JS_TARGET).min.js: $(JS_TARGET).js
	$(NPM_BIN)/uglifyjs $< -o $@ -c -m

