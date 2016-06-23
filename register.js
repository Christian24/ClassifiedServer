/**
 * Created by Julian on 20.05.2016.
 */
var db = require("./db.js");

var pool = db();

var base64 = require("./base64");

module.exports = function (request, response) {

    var user = base64.decode(request.params.user);
    var salt_masterkey = request.body.salt_masterkey;
    var pubkey_user = request.body.pubkey_user;
    var privkey_user_enc = request.body.privkey_user_enc;

    console.log("---------------------------------------------------");
    console.log(new Date().toUTCString());
    "Request body:"
    console.log("User: " + request.params.user);
    console.log("salt_masterkey: " + request.body.salt_masterkey);
    console.log("pubkey_user: " + request.body.pubkey_user);
    console.log("privkey_user_enc: " + request.body.privkey_user_enc);
    console.log("---------------------------------------------------");
    
    if(user && salt_masterkey && pubkey_user && privkey_user_enc) {
        var client = pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }


            /**
             * Check if the user already exists. If so, send back user defined error.(JH)
             */
            if (err) {

                console.log("---------------------------------------------------");
                console.log(new Date().toUTCString());
                console.log("Database connection error while trying to register new user '" + user + "'.");
                console.log(err);
                console.log("---------------------------------------------------");
                response.status(500).end("Internal Server Error");
            }else{
                client.query("Select username from Users where username = $1 ", [user], function (error, result) {
                    done();
                    if (error) {
                        console.log("---------------------------------------------------");
                        console.log(new Date().toUTCString());
                        console.log("Error while executing check for existing users. (register.js)");
                        console.error(error);
                        console.log("---------------------------------------------------");
                        client.release();
                        response.status(500).end("Internal Server Error");
                    } else {
                        console.log("This is the length: " + result.rows.length);
                        if (result.rows.length != 0) {
                            console.log("---------------------------------------------------");
                            console.log(new Date().toUTCString());
                            console.log("A user with the name '" + user + "' already exists. (register.js)");
                            console.log("---------------------------------------------------");
                            client.release();
                            response.status(444).end("User already exists");


                        }else{
                            client.query("INSERT INTO Users VALUES($1,$2,$3,$4)", [user, salt_masterkey, pubkey_user, privkey_user_enc], function (error) {
                                if (error) {
                                    console.log("---------------------------------------------------");
                                    console.log(new Date().toUTCString());
                                    console.log("Error while creating new user: "+user+". (register.js)");
                                    console.log(error);
                                    console.log("---------------------------------------------------");
                                    client.release();
                                    response.status(400).end("Sorry this is shit");
                                } else {

                                    console.log("---------------------------------------------------");
                                    console.log(new Date().toUTCString());
                                    console.log("Database connection error while trying to register new user '" + user + "'.");
                                    console.log(err);
                                    console.log("---------------------------------------------------");
                                    client.release();
                                    response.status(200).end("User erfolgreich angelegt");
                                }
                            })

                        }
                    }
                })
            }
        })
    } else {
        response.status(400).end("Daten unvollständig.");
    }

};
