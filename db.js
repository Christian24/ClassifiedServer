/**
 * Created by Julian on 09.06.2016.
 */
/**
 * POSTGRESQL Connector.
 */
var pg = require("pg");
var conString="postgres://postgres:root@localhost:5432/webwemser";
module.exports={
    client:function(){
        return new pg.Client(conString);
    }
}