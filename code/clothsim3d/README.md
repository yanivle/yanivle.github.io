# clothsim3d
To compile:
tsc ts/*.ts -t ES2016 --pretty --lib dom,es6 --outDir compiled.js/ --watch

To compile to a single file (loadable with require.js):
tsc ts/*.ts -t ES2016 --pretty --lib dom,es6 --outDir compiled.js/ --watch --outFile clothsim.js --module amd

To run:
http-server 
