let read = require("body-parser/lib/read");
let cborEncoder = require('cbor');
var bytes = require('bytes');
var debug = require('debug')('cbor-parser');
var typeis = require('type-is');

module.exports = function cbor(options) {

    let opts = options || {};
    let inflate = opts.inflate !== false
    let limit = typeof opts.limit !== 'number' ? bytes.parse(opts.limit || '100kb') : opts.limit;
    let type = opts.type || 'application/cbor';

    let verify = opts.verify || false;
    if (verify !== false && typeof verify !== 'function') {
        throw new TypeError('option verify must be function')
    }

    // create the appropriate type checking function
    const shouldParse = typeof type !== 'function' ? typeChecker(type) : type;

    function parse(buf) {
        if (buf.length === 0) {
            debug('buffer is zero');
            return {}
        }
        debug('parsing message-pack content');
        return cborEncoder.decode(buf);
    }

    return function cborParser(req, res, next) {
        if (req._body) {
            return debug('body already parsed'), next()
        }

        req.body = req.body || {};

        // skip requests without bodies
        if (!typeis.hasBody(req)) {
            return debug('skip empty body'), next()
        }

        debug('content-type %j', req.headers['content-type'])

        // determine if request should be parsed
        if (!shouldParse(req)) {
            return debug('skip parsing'), next()
        }

        // read
        read(req, res, next, parse, debug, {
            encoding: null,
            inflate: inflate,
            limit: limit,
            verify: verify
        })
    }
}

/**
 * Get the simple type checker.
 *
 * @param {string} type
 * @return {function}
 */

function typeChecker(type) {
    return function checkType(req) {
        return Boolean(typeis(req, type))
    }
}
