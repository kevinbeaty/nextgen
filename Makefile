PROJECT:=nextgen

JS_TARGET ?= build/$(PROJECT).js

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

js: $(JS_TARGET) $(JS_TARGET:.js=.min.js)

$(JS_TARGET): $(PROJECT).js | build
	`npm bin`/browserify -t 6to5ify $< > $@

build:
	mkdir -p build
