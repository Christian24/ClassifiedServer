var crypto = require("crypto");
var logger= require("./logger.js");
/**
 * Created by Christian on 10.06.2016.
 * Creates a hash from envelope, timestamp, recipient and key
 */
module.exports = function (envelope,timestamp,recipient,key) {
var hash = crypto.createHash("sha256");
    hash.update(key).update(envelope).update(timestamp).update(recipient)
   return hash.digest("base64");
};