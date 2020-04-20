const should = require('should');
const request = require('supertest');
const cborParser = require('..');
const cbor = require("cbor");

const _ = require("underscore");
const express = require("express");
const bodyParser = require("body-parser");
bodyParser.cbor = cborParser;

describe('cborparser as express app', function () {
    it('should parse json', function (done) {
        request(createExpressServer())
            .post('/')
            .set('Content-Type', 'application/json')
            .send('{"user":"tobi"}')
            .expect(200)
            .end( (err, res) => {
                should.exist(res.body);
		let data = res.body;
                should.exist(data);
		should.exist(data.cbor); 
		should(data.cbor).be.equal(false);
                done();
            });
    });

    it('should parse cbor with a correct content type', function (done) {
        request(createExpressServer())
            .post('/')
            .set('Content-Type', 'application/cbor')
            .send(cbor.encode({"user":"tobi"}))
            .expect(200)
            .responseType('blob')
            .end( (err, res) => {
                const decodedData = cbor.decode(res.body);
                should.exist(decodedData);
                should.exist(decodedData.user);
		should.exist(decodedData.cbor); 
		should(decodedData.cbor).be.equal(true);
                should(decodedData.user).be.equal("tobi");
                done();
            });
    });
    it('should reject cbor with a too big body according to limit option', function (done) {
        const bigPayload = {
                    "user":"tobi", 
                    "1": "dsfjkhaosdfhsijdhfaisdhfakjsdhfklajshdfkjahsdflkasdkjsofgjsd9u239ruaosidfa0shfdaos09jdf",
                    "2": "dsfjkhaosdfhsijdhfaisdhfakjsdhfklajshdfkjahsdflkasdkjsofgjsd9u239ruaosidfa0shfdaos09jdf",
                    "3": "dsfjkhaosdfhsijdhfaisdhfakjsdhfklajshdfkjahsdflkasdkjsofgjsd9u239ruaosidfa0shfdaos09jdf",
                    "4": "dsfjkhaosdfhsijdhfaisdhfakjsdhfklajshdfkjahsdflkasdkjsofgjsd9u239ruaosidfa0shfdaos09jdf",
                    "5": "dsfjkhaosdfhsijdhfaisdhfakjsdhfklajshdfkjahsdflkasdkjsofgjsd9u239ruaosidfa0shfdaos09jdf",
                    "6": "dsfjkhaosdfhsijdhfaisdhfakjsdhfklajshdfkjahsdflkasdkjsofgjsd9u239ruaosidfa0shfdaos09jdf",
                };
        request(createExpressServer())
            .post('/')
            .set('Content-Type', 'application/cbor')
            .send(cbor.encode(bigPayload))
            .expect(422)
            .responseType('blob')
            .end( (err, res) => {
                let data = cbor.decode(res.body);
                should.not.exist(data.user);
                should.exist(data.err);
                done();
            });
    });
});

function createExpressServer() {
    const app = express();
    app.use(bodyParser.json({ limit: "4mb"}));
    app.use(bodyParser.cbor({ limit: '500B'}));

    app.use((err, req, res, next) => {
        if(err) {
            if( req.is("application/cbor")){
                return res.status(422).end(cbor.encode({err: err.message}));
            } 
            return res.status(422).json({err: err.message});
        }
        else next();
    });

    app.post("/", (req, res, next) => {
        if( req.is("application/cbor")){
	    let returnData = req.body; 
            returnData.cbor = true; 
            const encodedData = cbor.encode(returnData);
            res.setHeader("content-type", "application/cbor");
            res.setHeader('content-length', _.size(encodedData));
            return res.status(200).end(encodedData);
        }else{
	    let returnData = req.body; 
            returnData.cbor = false; 
            return res.status(200).json(returnData);
        }
    });
    return app;

}
