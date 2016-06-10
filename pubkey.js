/**
 * Created by Julian on 20.05.2016.
 */
var getPubkey = require("./getPubkey");
var db = require("./db.js");
var client = db();
var base64 = require("./base64");
module.exports = function (request, response) {
    var user = base64.decode(request.body.user);
    if(user) {
       getPubkey(user,function (error, result) {
            if(error) {
                console.log(error);
                response.status(400).end("Sorry");
            }else {
                if(result) {
                    response.status(200).send(JSON.stringify(result.rows[0])).end();
                } else {
                    response.status(404).end("Sorry");
                }
            }
        })
    } else {
        console.log("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }

};