var express = require("express");
var app = express();


/**
 * Setup Winston logger to write into file.
 */
var logger= require("./logger.js");
logger.info("---------------------------------------------------");
logger.info("Server is starting ...");
/*
 * Body Parser
 */
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/**
 * POSTGRESQL
 */
var db = require("./db.js");
var pool = db.pool();
pool.connect(function(err,client,done){
    if(err){
        logger.info("---------------------------------------------------");
        logger.info(new Date().toUTCString());
        logger.info("Database connection error while trying to setup database");
        logger.error(err);
        response.status(500).end("Internal Server Error");
    }else {
        client.query('CREATE TABLE IF NOT EXISTS Users(username varchar(255),salt_masterkey text not null, pubkey_user text not null, privkey_user_enc text not null, primary key(username) )');
        client.query('CREATE TABLE IF NOT EXISTS Messages(id SERIAL, recipient varchar(255) NOT NULL, timestamp integer NOT NULL, sig_service varchar(255) NOT NULL,  sender varchar(255) NOT NULL, cipher text NOT NULL, iv varchar(255) NOT NULL, key_recipient_enc text NOT NULL, sig_recipient text NOT NULL, primary key(id) )');
        done();
    }}
);

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

logger.info("---------------------------------------------------");
logger.info("Server startet on: " + new Date().toUTCString());
app.listen(process.env.PORT || 64495);
