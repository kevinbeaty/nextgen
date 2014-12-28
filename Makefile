PROJECT:=nextgen

JS_TARGET ?= build/$(PROJECT)

.PHONY: all clean js test serve
all: test js

clean:
	rm -rf build

test: | node_modules
	node --harmony `npm bin`/tape test/*.js

node_modules:
	npm install

%.min.js: %.js | node_modules
	`npm bin`/uglifyjs $< -o $@ -c -m

%.gz: %
	gzip -c9 $^ > $@

js: $(JS_TARGET).js $(JS_TARGET).min.js

$(JS_TARGET).js: $(JS_TARGET).reg.js
	`npm bin`/browserify $< > $@
	
$(JS_TARGET).reg.js: $(PROJECT).js | build
	`npm bin`/regenerator $< > $@

build:
	mkdir -p build
