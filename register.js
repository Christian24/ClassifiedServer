/**
 * Created by Julian on 20.05.2016.
 */
var db = require("./db.js");
var client = db.client();
module.exports = function (request, response) {

        var user =request.body.user;
    var salt_masterkey = request.body.salt_masterkey;
    var pubkey_user = request.body.pubkey_user;
var privkey_user_enc = request.body.privkey_user_enc;
    if(user && salt_masterkey && pubkey_user && privkey_user_enc) {
        db.serialize(function () {
            console.log(salt_masterkey);

            /**
             * Check if the user already exists. If so, send back user defined error.(JH)
             */
            db.run("Select Count user as count_user from Users where user = ? ", [user], function(error,row){
                if(error){
                    console.log(error);
                    response.status(500).end("Sorry");
                } else {
                    if(row.count_user > 0){
                        response.status(444).end("User already exists");
                    }
                }
            });


            client.query("INSERT INTO Users VALUES(?,?,?,?)",[user,salt_masterkey,pubkey_user,privkey_user_enc],function (error) {
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

};
