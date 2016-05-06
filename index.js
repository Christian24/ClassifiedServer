var express = require("express");
var app = express();
app.get("/",function(request,response){
    response.write("Hallo Welt.");
    response.end();
});
app.listen("3000");