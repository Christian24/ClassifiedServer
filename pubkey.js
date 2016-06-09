/**
 * Created by Julian on 20.05.2016.
 */
var getPubkey = require("./getPubkey");
var db = require("./db.js");
var client = db.client();
module.exports = function (request, response) {
    var user = request.params.user;
    if(user) {
       getPubkey(user,function (error, row) {
            if(error) {
                console.log(error);
                response.status(400).end("Sorry");
            }else {
                if(row) {
                    response.status(200).send(JSON.stringify(row)).end();
                } else {
                    response.status(404).end("Sorry");
                }
            }
        });
    } else {
        console.log("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }

}