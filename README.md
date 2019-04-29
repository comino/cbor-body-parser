

# CBOR body parser for Express

This is a simple cbor body parser for express by extending the existing npm module 'body-parser'.
This is not yet ready for production use. 

Example implementation : 

```
	let express = require("express");
	let bodyparser = require("body-parser");
	bodyparser.cbor = require("cbor-body-parser");

	let app = express();
	app.use(bodyParser.json());
    	app.use(bodyParser.cbor());

	app.post("/", (req, res) => {
		console.log(req.body);	
		res.status(200).json(req.body);
	})

		
```


