var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var send = require("./send.js");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/",function(request,response){
    response.write("Hallo Welt.");
    response.end();
});
app.post("/send",send);

app.listen("3000");