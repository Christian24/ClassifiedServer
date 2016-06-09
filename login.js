/**
 * Created by Julian on 20.05.2016.
 */
var db = require("./db.js");
var client = db.client();
module.exports = function (request, response) {
   // console.log(request.body);
    var user = request.params.user;
    if(user) {
        var sql = "SELECT salt_masterkey, privkey_user_enc, pubkey_user from Users WHERE user = $1";
        var statement = client.query(sql,[user],function (error, result) {
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
        });
    } else {
        console.log("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }


}