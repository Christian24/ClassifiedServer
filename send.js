/**
 * Created by Sergei on 27.05.2016.
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./webwemser.db');
var timestamp = Date.now();
module.exports = function (request, response) {
	response.end("Danke für deine Nachricht: " + request.body.title);
	var user = requests.params.user;
	if(user) {
		var sql = "SELECT pubkey_user from Users WHERE user = ?";
	}
}
