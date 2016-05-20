var express = require("express");
var app = express();
/**
 * Body Parser
 */
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
app.post("/send",send);
app.post("/register",register);
app.get("/login",login);
app.get("/users/",pubkey);
app.get("/messages",messages);


app.listen("3000");