var express = require("express");
var app = express();
/**
 * Body Parser
 */
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * POSTGRESQL
 */
var db = require("./db.js");
var client = db.client();
if(!client){
    console.log("NO PG-Client");
}else{
    console.log("pgclient");
}
client.connect(function(err) {
    if(err){
        console.log(err);
    }else {
        client.query('CREATE TABLE IF NOT EXISTS Users( "user" varchar(255),salt_masterkey text not null, pubkey_user text not null, privkey_user_enc text not null, primary key("user") )');
        client.query('CREATE TABLE IF NOT EXISTS Messages(id integer, recipient varchar(255), timestamp integer, sig_service varchar(255),  sender varchar(255), cipher text, iv integer, key_recipient_enc text, sig_recipient text, read integer, primary key(id) )');
        client.end();
    }
});



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


app.listen(process.env.PORT || 3000);