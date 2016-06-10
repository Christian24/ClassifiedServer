/**
 * Created by Julian on 20.05.2016.
 */
var db = require("./db.js");
var client = db.client();
var base64 = require("./base64");

module.exports = function (request, response) {

    var user = base64.decode(request.body.user);
    var salt_masterkey = request.body.salt_masterkey;
    var pubkey_user = request.body.pubkey_user;
    var privkey_user_enc = request.body.privkey_user_enc;
    if(user && salt_masterkey && pubkey_user && privkey_user_enc) {
            console.log(salt_masterkey);

            /**
             * Check if the user already exists. If so, send back user defined error.(JH)
             */
            client.query("Select Count user as count_user from Users where user = $1 ", [user], function(error,result){
                if(error){
                    console.log(error);
                    response.status(500).end("Sorry");
                } else {
                    if(result.rows["count_user"] > 0){
                        response.status(444).end("User already exists");
                    }
                }
            });


            client.query("INSERT INTO Users VALUES($1,$2,$3,$4)",[user,salt_masterkey,pubkey_user,privkey_user_enc],function (error) {
                if(error) {
                    console.log(error);
                    response.status(400).end("Sorry");
                } else {
                    console.log("User "+user+" successfully created.")
                    response.status(200).end("Danke für deine Nachricht: ");
                }
            });


    } else {
        console.log("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }

};
