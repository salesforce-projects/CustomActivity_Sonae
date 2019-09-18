'use strict';

var util = require('util');

var respostaAuth;
var path;
// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const ET_Client = require('sfmc-fuelsdk-node');
const FuelRest = require('fuel-rest');
const options = {
	auth: {
		// options you want passed when Fuel Auth is initialized
		clientId: 'cfly1ym6xx6y34jbqw0idypq',
		clientSecret: 'FXaTXByn5UyO7r1equQ8OwxU'
	}
};
const RestClient = new FuelRest(options);
//const client = new ET_Client('cfly1ym6xx6y34jbqw0idypq', 'FXaTXByn5UyO7r1equQ8OwxU', 's50'); 


var util = require('util');
var http = require('https');
var jsonSize = require('json-size'); 

exports.logExecuteData = [];
console.log("JWT" + JWT);
function logData(req) { 
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.hostname,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.hostname);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
	res.status(200).send('Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
	res.status(200).send('Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    
    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            return res.status(401).end();
        }
			
        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {

            /*ENDPOINT INTERFACE*/
            var endpoint = decoded.inArguments[0].Endpoint;
            var host;   
            var indexPath;
            for (var i = 0; i < endpoint.length; i++) {
                if (endpoint.substring(i, i+1) == '/'){
                    host = endpoint.substring(0, i);
                    indexPath = i;
                    break;
                }
             }
             path = endpoint.substring(indexPath, endpoint.length);
             
             /*ENDPOINT INTERFACE*/

            /*----------------------ACESSTOKEN-----------------------*/
            var body = {
                "grant_type": 'client_credentials',
                "client_id": 'yxvkvkkn3sixeuxv3ha4z94d',
                "client_secret": '2EG7sOFjI5wrevOHMOE3ZEWL'
            };
            
            var data = JSON.stringify(body)

            var options = {
                hostname: 'mcdgsnqlh4ybg-9cyt895ypwkxh0.auth.marketingcloudapis.com',
                path: '/v2/token',
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Content-Length': jsonSize(body)
                }
            }

            const req2 = http.request(options, (res) => {
                console.log('statusCode: ' + res.statusCode)
                
                let chunks = [];
                res.on('data', (d) => {
                chunks.push(d);
                }).on('end', function() {
                    let data   = Buffer.concat(chunks);
                    respostaAuth = JSON.parse(data);
                    HISTORYJOURNEY(respostaAuth.access_token);
                });
            }) 

            req2.on('error', (error) => {
                console.error(error)
            })
            req2.write(data);
            req2.end();
            /*----------------------ACESSTOKEN-----------------------*/
//+ decoded.inArguments[0].DefinitionId +
            

			res.status(200).send('Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};

function HISTORYJOURNEY(access){
            /*----------------------HISTORYJOURNEY-------------------*/
            
            var body = {
                "from": 0,
                "size": 100,
                "filter": {
                    "fquery": {
                        "query": {
                            "query_string": {	
                                "query": "(definitionId:54a8bbab-4a74-4b73-bdbd-ec0d582b2f88) AND(transactionTime:[2019-09-05T13:20:45.101Z TO *])"
                            }
                        }
                    }
                }
            };
            var respostaJourneyInfo;
            var data = JSON.stringify(body)

            
            var options = {
                hostname: 'mcdgsnqlh4ybg-9cyt895ypwkxh0.rest.marketingcloudapis.com',
                path: '/interaction/v1/interactions/traceevents/search',
                method: 'POST',
                headers: {
                'Authorization' : 'Bearer ' + access,
                'Content-Type': 'application/json',
                'Content-Length': jsonSize(body)
                }
            }

            const req3 = http.request(options, (res) => {
                console.log('statusCode: ' + res.statusCode)
                
                let chunks = [];
                res.on('data', (d) => {
                chunks.push(d);
                }).on('end', function() {

                var data = Buffer.concat(chunks);
                var datastring = data.toString();
                data = datastring.replace(/\\/g,"");
                respostaJourneyInfo = data.slice(1,-1);
                data = JSON.parse(respostaJourneyInfo); 

                });
            }) 

            req3.on('error', (error) => {
                console.error(error)
            })
            req3.write(data);
            req3.end();
        /*----------------------HISTORYJOURNEY-----------------------*/    
};
/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send('Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
	res.status(200).send('Validate');
};