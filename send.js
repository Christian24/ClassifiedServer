/**
 * Created by Christian on 20.05.2016.
 */
module.exports = function (request, response) {
    var username = request.body.name;
response.end("Danke für deine Nachricht: " + username);
}