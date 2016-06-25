var crypto = require("crypto");

/**
 * Created by Christian on 10.06.2016.
 * Creates a hash from envelope, timestamp, recipient and key
 */
module.exports = function (envelope,timestamp,recipient,key) {
return crypto.createHash("sha256",key).update(envelope).update(timestamp).update(recipient).digest("base64");
};