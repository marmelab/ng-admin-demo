.PHONY: build

install:
	@npm install

build: copy-ng-admin
	@./node_modules/.bin/webpack  --progress --colors --devtool source-map

copy-ng-admin:
	@cp ./node_modules/ng-admin/build/ng-admin.min.js build/
	@cp ./node_modules/ng-admin/build/ng-admin.min.js.map build/

run: copy-ng-admin
	@echo "**************************************************"
	@echo "* open http://localhost:8080/webpack-dev-server/ *"
	@echo "**************************************************"
	@./node_modules/.bin/webpack-dev-server --host=0.0.0.0 --progress --colors --devtool cheap-module-inline-source-map --hot --inline

data:
	@node dataGenerator/generate.js
