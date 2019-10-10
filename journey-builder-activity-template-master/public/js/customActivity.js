'use strict';

var util = require('util');

var respostaAuth;
var path;
var host;
var decodedArgs;
var journeyInfoJson;
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
var util = require('util');
var http = require('https');
var jsonSize = require('json-size'); 

exports.logExecuteData = [];

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
            decodedArgs = decoded.inArguments[0];
            const data = JSON.stringify(decodedArgs)

								const options = {
								  hostname: 'postb.in',
								  path: '/1570714229122-4677748421672',
								  method: 'POST',
								  headers: {
									'Content-Type': 'application/json',
									'Content-Length': jsonSize(decoded.inArguments[0])
								  }
								}

								const req2 = http.request(options, (res) => {
								  console.log('statusCode: ${res.statusCode}')

								  res.on('data', (d) => {
									process.stdout.write(d)
								  })
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

function historyJourney(access){
            /*----------------------HISTORYJOURNEY-------------------*/
            
            var body = {
                "from": 0,
                "size": 100,
                "filter": {
                    "fquery": {
                        "query": {
                            "query_string": {	
                                "query": "(definitionId:" + decodedArgs.DefinitionId + ") AND(transactionTime:[2019-09-05T13:20:45.101Z TO *])"
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
                journeyInfoJson = JSON.parse(respostaJourneyInfo); 
                sendInformation();
                });
            }) 

            req3.on('error', (error) => {
                console.error(error)
            })
            req3.write(data);
            req3.end();
        /*----------------------HISTORYJOURNEY-----------------------*/    
};

function sendInformation(){
    /*----------------------SENDINFORMATION-----------------------*/ 
    var body = {
        "Email": decodedArgs.Email,
        "client_id": journeyInfoJson.took
    };

    const data = JSON.stringify(body)

    const options = {
        hostname: host,
        path: path,
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Content-Length': jsonSize(body)
        }
    }

    const req2 = http.request(options, (res) => {
        console.log('statusCode: ${res.statusCode}')

        res.on('data', (d) => {
        process.stdout.write(d)
        })
    }) 

    req2.on('error', (error) => {
        console.error(error)
    })

    req2.write(data);
    req2.end();

    /*----------------------SENDINFORMATION-----------------------*/ 
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.listener = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send('Listen');
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