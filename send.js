/**
 * Created by Christian on 20.05.2016.
 */
module.exports = function (request, response) {
response.end("Danke für deine Nachricht: " + request.body.title);

}