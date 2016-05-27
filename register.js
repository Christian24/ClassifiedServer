/**
 * Created by Julian on 20.05.2016.
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./webwemser.db');
module.exports = function (request, response) {

        var user =request.body.user;
    var salt_masterkey = request.body.salt_masterkey;
    var pubkey_user = request.body.pubkey_user;
var privkey_user_enc = request.body.privkey_user_enc;
    if(user && salt_masterkey && pubkey_user && privkey_user_enc) {
        db.serialize(function () {
            console.log(salt_masterkey);

            db.run("INSERT INTO Users VALUES(?,?,?,?)",[user,salt_masterkey,pubkey_user,privkey_user_enc],function (error) {
                if(error) {
                    console.log(error);
                    response.status(400).end("Sorry");
                } else {
                    response.status(200).end("Danke für deine Nachricht: ");
                }
            });

        });
    } else {
        console.log("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }

}
