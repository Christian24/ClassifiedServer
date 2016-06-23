/**
 * Created by Julian on 10.06.2016.
 * Basic base64 implementation to provide easy access to base64-encoding and decoding.
 */

/**
 * Setup Winston logger to write into file.
 * @type {any|*}
 */
var winston = require('winston');
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({filename: '/var/log/logF.log'})
    ]
});


var base64 = exports;
/**
 * Function to encode a given string
 * @param unencoded
 * @returns {String}
 */
base64.encode = function (unencoded) {
    return new Buffer(unencoded || '').toString('base64');
};
/**
 * Turns base64-encoded parameter and returns utf8-encoded string
 * @param encoded
 * @returns {String}
 */
base64.decode = function (encoded) {
    return new Buffer(encoded || '', 'base64').toString('utf8');
};