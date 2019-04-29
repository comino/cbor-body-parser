

# CBOR body parser for Express

This is a simple cbor body parser for express by extending the existing npm module 'body-parser'.
This is not yet ready for production use. 

Example implementation : 

```

let express = require("express");
let bodyParser = require("body-parser");
bodyParser.cbor = require("cbor-body-parser");

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.cbor());

app.post("/", (req, res) => {
	console.log("Payload: " + JSON.stringify(res.body)); 
	res.status(200).json(req.body);
})
app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
});

		
```

To test this implementation:
```
gem install cbor-diag
echo '{"user":"marry"}' | json2cbor.rb | curl -d @- -H "Content-Type: application/cbor" -X POST http://localhost:3000/

```


