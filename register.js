/**
 * Created by Julian on 20.05.2016.
 */
var db = require("./db.js");
var client = db();
var base64 = require("./base64");

module.exports = function (request, response) {

    var user = base64.decode(request.params.user);
    var salt_masterkey = request.body.salt_masterkey;
    var pubkey_user = request.body.pubkey_user;
    var privkey_user_enc = request.body.privkey_user_enc;
    if(user && salt_masterkey && pubkey_user && privkey_user_enc) {
        client.connect(function(err) {
            /**
             * Check if the user already exists. If so, send back user defined error.(JH)
             */
            if (err) {
                console.log("---------------------------------------------------");
                console.log(new Date().toUTCString());
                console.log("Database connection error while trying to register new user '"+ user+ "'.");
                console.log(err);
                console.log("---------------------------------------------------");
                response.status(500).end("Internal Server Error");
            }
                client.query("Select Count('user') as count_user from Users where 'user' = $1 ", [user], function (error, result) {
                    if (error) {
                        console.log("---------------------------------------------------");
                        console.log(new Date().toUTCString());
                        console.log("Error while executing check for existing users. (register.js)");
                        console.error(error);
                        console.log("---------------------------------------------------");
                        response.status(500).end("Internal Server Error");
                    } else {
                        if (result.rows[0].count_user > 0) {
                            console.log("---------------------------------------------------");
                            console.log(new Date().toUTCString());
                            console.log("A user with the name '"+ user +"' already exists. (register.js)");
                            console.log("---------------------------------------------------");
                            response.status(444).end("User already exists");

                        }else{
                            client.query("INSERT INTO Users VALUES($1,$2,$3,$4)", [user, salt_masterkey, pubkey_user, privkey_user_enc], function (error) {
                                if (error) {
                                    console.log("---------------------------------------------------");
                                    console.log(new Date().toUTCString());
                                    console.log("Error while creating new user: "+user+". (register.js)");
                                    console.log(error);
                                    console.log("---------------------------------------------------");
                                    response.status(400).end("Sorry");
                                } else {
                                    console.log("---------------------------------------------------");
                                    console.log(new Date().toUTCString());
                                    console.log("User " + user + " successfully created.");
                                    console.log("---------------------------------------------------");
                                    response.status(200).end("User erfolgreich angelegt");
                                }
                            });
                        }
                    }
                });
        })
    } else {
        console.log("---------------------------------------------------");
        console.log(new Date().toUTCString());
        console.log("Daten unvollständig:");
        console.log("User: " + request.params.user);
        console.log("salt_masterkey: " + request.body.salt_masterkey);
        console.log("pubkey_user: " + request.body.pubkey_user);
        console.log("privkey_user_enc: " + request.body.privkey_user_enc);
        console.log("---------------------------------------------------");
        response.status(400).end("Daten unvollständig.");
    }

};
