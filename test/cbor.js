const http = require('http');
const should = require('should');
const methods = require('methods');
const request = require('supertest');
const cborParser = require('..');
const cbor = require("cbor");

const _ = require("underscore");
const express = require("express");
const bodyParser = require("body-parser")
bodyParser.cbor = cborParser;

describe('A2 cborparser as express app', function () {
    it('should parse json', function (done) {
        request(createExpressServer())
            .post('/')
            .set('Content-Type', 'application/json')
            .send('{"user":"tobi"}')
            .expect(200)
            .end( (err, res) => {
                should.exist(res.body);
                should.exist(res.body.user);
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
                console.log(decodedData);
                should.exist(decodedData);
                should.exist(decodedData.user);
                should(decodedData.user).be.equal("tobi");
                done();
            });
    });
});

function createExpressServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.cbor());

    app.post("/", (req, res, next) => {
        if( req.is("application/cbor")){
            const encodedData = cbor.encode(req.body);
            res.setHeader("content-type", "application/cbor");
            res.setHeader('content-length', _.size(encodedData));
            return res.status(200).end(encodedData);
        }
        console.log("no cbor");
        return res.status(200).json(req.body);
    });


    return app;

}
