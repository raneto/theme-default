#!/usr/bin/make

# The first command listed is the default
.PHONY: default
default: clean install build;

.PHONY: clean
clean:

	# Remove Temporary Files
	rm ./package-lock.json;
	rm -rf ./node_modules/;

.PHONY: install
install:

	# Install Node.js Modules
	npm install;

.PHONY: build
build:

	# Generate ./dist/ directory
	rm -rf ./dist/;
	npm run build;
