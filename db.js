/**
 * Created by Julian on 09.06.2016.
 */
/**
 * POSTGRESQL Connector.
 */
var pg = require("pg");
var conString="postgres://rbmokhcvrfyiky:N8Zf-l_hee3NCA4mqjxeQGlZ9p@ec2-54-163-239-12.compute-1.amazonaws.com:5432/d253prihss1ba3";
module.exports={
    client:function(){ 
        return new pg.Client(conString);
    }
}