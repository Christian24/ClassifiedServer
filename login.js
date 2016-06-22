/**
 * Created by Julian on 20.05.2016.
 */
var db = require("./db.js");
var pool = db.pool();
var base64 = require("./base64.js");
module.exports = function (request, response) {
    var user = base64.decode(request.params.user);
    console.info("User "+ user +" trying to login.");
    if(user) {
        console.info("logging in user "+user+".");
        pool.connect(function(err,client,done){
            if(err){
                console.info("---------------------------------------------------");
                console.info(new Date().toUTCString());
                console.info("Database connection error while trying to login new user '"+ user+ "'.");
                console.error(err);
                console.info("---------------------------------------------------");
                response.status(500).end("Internal Server Error");
            }else {
                console.log("searching for userdata");
                client.query("SELECT salt_masterkey, privkey_user_enc, pubkey_user from Users WHERE username = $1",[user],function (error, result) {
                    done();
                    if (error) {
                        console.log("Error handled.");
                        console.log(error);
                        response.status(400).end("Sorry");
                    } else {
                        console.log("No error occured.");
                        if (result) {
                            console.info("The Result:");
                            console.info("User " + user + " successfully logged in.");
                            response.status(200).send(JSON.stringify(result.rows[0])).end();
                        } else {
                            response.status(404).end("Sorry");
                        }
                    }
                });
            }
        });
    } else {
        console.info("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }
};