/**
 * Created by Julian on 09.06.2016.
 */
/**
 * POSTGRESQL Connector.
 */

var Pool = require("pg-pool");
//var conString="postgres://rbmokhcvrfyiky:N8Zf-l_hee3NCA4mqjxeQGlZ9p@ec2-54-163-239-12.compute-1.amazonaws.com:5432/d253prihss1ba3";
module.exports=
    function(){
        var config ={
            user: "rbmokhcvrfyiky",
            password: "N8Zf-l_hee3NCA4mqjxeQGlZ9p",
            database: "d253prihss1ba3",
            port: 5432,
            host: "ec2-54-163-239-12.compute-1.amazonaws.com",
            ssl: true,
            min: 4,
            max: 10
        };
        var pool = new Pool(config);
        return pool;

};