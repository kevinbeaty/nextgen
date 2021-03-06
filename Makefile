PROJECT:=nextgen
NPM_BIN:=$(shell npm bin)

JS_TARGET ?= dist/$(PROJECT)

.PHONY: all clean js test
all: test js

clean:
	rm -rf build dist

test: | node_modules
	node --harmony $(NPM_BIN)/tape test/*.js

node_modules:
	npm install

build:
	mkdir -p build

dist:
	mkdir -p dist

js: $(JS_TARGET).min.js

build/index.js: index.js lib/* | build dist node_modules
	$(NPM_BIN)/browserify -s nextgen $< -o $@

$(JS_TARGET).js: build/index.js
	$(NPM_BIN)/regenerator $< > $@

$(JS_TARGET).min.js: $(JS_TARGET).js
	$(NPM_BIN)/uglifyjs $< -o $@ -c -m

