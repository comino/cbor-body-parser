

# cbor body parser 
## A cbor parser for Express

This is a very simple cbor body parser for express by extending the existing npm module 'body-parser'.
It wraps https://github.com/hildjj/node-cbor into a middleware. 

## Installation
```sh
$ npm install cbor-body-parser
```

## Example server side usage: 
```js
let express = require("express");
let bodyParser = require("body-parser");
bodyParser.cbor = require("cbor-body-parser");

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.cbor({limit: "100kB"}));

app.post("/", (req, res) => {
	console.log("Got Payload: " + JSON.stringify(res.body)); 
	res.status(200).json(req.body);
})

app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
});
```

## Client side test 
```sh
$ gem install cbor-diag
$ echo '{"user":"marry"}' | json2cbor.rb | curl -d @- -H "Content-Type: application/cbor" -X POST http://localhost:3000/
```

## API

```js
	let cborBodyParser = require("cbor-body-parser");
```

### cborBodyParser.cbor([options])

The optional "options" object contains: 

#### limit 
Controls the maximum request body size. If this is a number, then the value
specifies the number of bytes; if it is a string, the value is passed to the
[bytes](https://www.npmjs.com/package/bytes) library for parsing. Defaults
to `'100kb'`.

#### type 
The `type` option is used to determine what media type the middleware will
parse. This option can be a string, array of strings, or a function. If not a
function, `type` option is passed directly to the
[type-is](https://www.npmjs.org/package/type-is#readme) library and this can
be an extension name (like `cbor`), a mime type (like `application/cbor`), or
a mime type with a wildcard (like `*/*` or `*/cbor`). If a function, the `type`
option is called as `fn(req)` and the request is parsed if it returns a truthy
value. Defaults to `application/cbor`.

#### verify 
The `verify` option, if supplied, is called as `verify(req, res, buf, encoding)`,
where `buf` is a `Buffer` of the raw request body and `encoding` is the
encoding of the request. The parsing can be aborted by throwing an error.

## Test
```sh
$ npm run test
```







