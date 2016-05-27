var express = require("express");
var app = express();
/**
 * Body Parser
 */
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/**
 * SQLITE
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./webwemser.db');
db.serialize(function () {
db.run("CREATE TABLE IF NOT EXISTS Users( user varchar(255),salt_masterkey text not null, pubkey_user text not null, privkey_user_enc text not null, primary key(user) )");
db.run("CREATE TABLE IF NOT EXISTS Messages( recipient varchar(255), timestamp integer, sig_service varchar(255),  sender varchar(255), cipher text, iv integer, key_recipient_enc text, sig_recipient text, primary key(recipient, timestamp) )");
});
db.close();
/**
 * Require request handlers
 */
var send = require("./send.js");
var register = require("./register.js");
var login = require("./login.js");
var pubkey = require("./pubkey.js");
var messages = require("./messages.js");
/**
 * Default action for "/"
 */
app.get("/",function(request,response){
    response.write("Hallo Welt.");
    response.end();
});
/**
 * routes and actions
 */
app.post("/:user/message",send);
app.post("/:user",register);
app.get("/:user",login);
app.get("/:user/pubkey",pubkey);
app.get("/:user/messages",messages);


app.listen("3000");