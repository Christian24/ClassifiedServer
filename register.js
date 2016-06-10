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
            console.log(user);

        client.connect(function(err, client, done) {
            /**
             * Check if the user already exists. If so, send back user defined error.(JH)
             */
            if (err) {
                console.log(err);
                response.status(500).end("Sorry");
            }
            if (client) {
                client.query("Select Count('user') as count_user from Users where 'user' = $1 ", [user], function (error, result) {
                    console.log("entered query");
                    if (error) {
                        console.log(error);
                        response.status(500).end("Sorry");

                    } else {
                        if (result.rowCount > 0) {
                            response.status(444).end("User already exists");

                        }else{
                            client.query("INSERT INTO Users VALUES($1,$2,$3,$4)", [user, salt_masterkey, pubkey_user, privkey_user_enc], function (error) {
                                if (error) {
                                    console.log(error);
                                    response.status(400).end("Sorry");
                                } else {
                                    console.log("User " + user + " successfully created.");
                                    response.status(200).end("Danke für deine Nachricht: ");
                                }
                            });
                        }
                    }
                });
            }
            done();
        })
    } else {
        console.log("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }

};
