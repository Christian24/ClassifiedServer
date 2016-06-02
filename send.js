/**
 * Created by Sergei on 27.05.2016.
 */
var getPubkey = require('./getPubkey.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./webwemser.db');
var timestamp = Date.now();
module.exports = function (request, response) {

	var user = requests.params.user;

	if(user) {
		getPubkey(user,function(error, row) {
            if(error) {
                console.log(error);
                response.status(400).end("Sorry");
            }else {
                if(row) {
                    response.status(200).send(JSON.stringify(row)).end();
                } else {
                    response.status(404).end("Sorry");
                }
            }
        });
	}
    response.end("Danke für deine Nachricht: " + request.body.title);
}
