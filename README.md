# Auth0 Docs CLI

This library provides a module to fetch Auth0 documentation both client and server side. Catching and fetching features are considered core details of this library

## Installation

To install the dependencies, execute:

`npm install`


## Usage (local)
To build and run the library locally, you can run
`npm run dev`, that will let you include the library from http://localhost:9999/docs-cli.js, there is an small demo to test the library in http://localhost:9999/

## Usage (deploy)
To use it, you have to include the script which has been built, it is built with major, minor and fix versions to be able to granularly specify versioning. You can include either the complete or minified version.

For example, for version 1.3.7, the following files will be built:

```
docs-cli-1.js
docs-cli-1.3.js
docs-cli-1.3.7.js
docs-cli-1.min.js
docs-cli-1.3.min.js
docs-cli-1.3.7.min.js
```

## Examples

### Basic set up

```
  var docs = new Auth0Docs();

  docs.get(path).then(function(result) {
    ...
  });
```

### Example 1: Setting a custom cache library (see https://github.com/jpodwys/cache-service)

```
  var myAwsomeCache = ...
  var docs = new Auth0Docs({ cache: myAwsomeCache });

  docs.get('connections').then(function(result) {
    ...
  });
```

### Example 2: Setting TTL (for the cache)
```
  var docs = new Auth0Docs({ ttl: 60 /* Secs */ });

  docs.get('connections/something').then(function(result) {
    ...
  });
```

### Example 3: Setting Base URL
```
  var docs = new Auth0Docs({ baseURL: 'http://myexample.com/meta' });

  docs.get('connections/something').then(function(result) {
    ...
  });
```

This example will do a request to http://myexample.com/meta/connections/something. 
Remember to set up CORs to be able to make the request.
