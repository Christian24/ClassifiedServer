var crypto = require("crypto");

/**
 * Created by Christian on 10.06.2016.
 * Creates a hash from envelope, timestamp, recipient and key
 */
module.exports = function (identity,timestamp,key) {
var hash =crypto.createHash("sha256");
    hash.update(key).update(identity).update(timestamp);
    return hash.digest("base64");
};