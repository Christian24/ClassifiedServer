var crypto = require("crypto");
var logger = require("./logger.js");

/**
 * Created by Christian on 10.06.2016.
 * Creates a hash from envelope, timestamp, recipient and key
 */
module.exports = function (user,timestamp,key,sig_utime) {
    logger.info("---------------------------------------------------");
    logger.info("Verifying signature sig_utime...");
/*var hash =crypto.createHash("sha256");
    hash.update(key).update(identity).update(timestamp);
    return hash.digest("base64");
*/
    logger.info("-------------------------------------");
    logger.info("Authentificating request with sig_utime.")
    logger.info("User: " + user);
    logger.info("Timestamp: " + timestamp);
    logger.info("Key: " + key);
    logger.info("Signature: " + sig_utime);

    var sig = sig_utime;
    var pubkey = key;

    var verify = crypto.createVerify('RSA-SHA256');
    verify.update(user+timestamp);
    return verify.verify(pubkey, new Buffer(sig, 'base64'))
};