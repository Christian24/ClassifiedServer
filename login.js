/**
 * Created by Julian on 20.05.2016.
 */
var db = require("./db.js");
var client = db.client();
module.exports = function (request, response) {
   // console.log(request.body);
    var user = request.params.user;
    if(user) {
        var sql = "SELECT salt_masterkey, privkey_user_enc, pubkey_user from Users WHERE user = ?";
        var statement = client.query(sql);
        statement.get([user],function (error, row) {
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