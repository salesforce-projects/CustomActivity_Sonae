'use strict';

var util = require('util');

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
 
 //Marketing cloud Node SDK Testing

    var bodyJson = JSON.parse('{\
        "from": 0,\
        "size": 100,\
        "filter": {\
            "fquery": {\
                "query": {\
                    "query_string": {	\
                        "query": "(definitionId:54a8bbab-4a74-4b73-bdbd-ec0d582b2f88) AND(transactionTime:[2019-09-05T13:20:45.101Z TO *])"\
                    }\
                }\
            }\
        }\
    }');
    //Marketing Cloud API resquest
    const optionspost = {
        uri: '/interaction/v1/interactions/traceevents/search',
        json: true,
        body: bodyJson
    };
    RestClient.post(optionspost, (err, response) => {
        if (err) {
            // error here
            console.log('ERRO SFMC HERE-> ' + err);
        }
        console.log('RESPONSE SFMC HERE-> ' + response.res);
    });

    //Get acess Token
    //Auth endpoint: https://mcdgsnqlh4ybg-9cyt895ypwkxh0.auth.marketingcloudapis.com/
   /* var body = {
        grant_type: 'client_credentials',
        client_id: 'yxvkvkkn3sixeuxv3ha4z94d',
        client_secret : '2EG7sOFjI5wrevOHMOE3ZEWL'
    };
    const data = JSON.stringify(body);
    console.log("REQUEST BODY POST -> " + data);
    console.log("SIZE JSON SFMC -> " + jsonSize(data));

                const options = {
                    hostname: 'mcdgsnqlh4ybg-9cyt895ypwkxh0.auth.marketingcloudapis.com',
                    path: '/v2/token',
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': jsonSize(data)
                    }
                }

                const req2 = http.request(options, (res) => {
                    console.log('statusCode SFMC: ' + res.statusCode)
                    console.log('BODY SFMC: ' + res.body)
                    res.on('data', (d) => {
                    process.stdout.write(d)
                    })
                }) 
                
                req2.on('error', (error) => {
                    console.error(error) 
                })
                
                req2.write(data);
                req2.end();

*/
    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error('ERRO AQUI: ' + err);
            return res.status(401).end();
        }
			
        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            console.log("entrou no if dos argumentos");
			console.log("ARGUMENT -> " + util.inspect(decoded.inArguments[0]));
            console.log ('SIZE -> ' + jsonSize(decoded.inArguments[0]));
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
             var path = endpoint.substring(indexPath, endpoint.length);

             console.log('HOST HERE -> ' + host);
             console.log('PATH HERE -> ' + path);
            // decoded in arguments
            var decodedArgs = decoded.inArguments[0];
            var body = {
                "grant_type": 'client_credentials',
                "client_id": 'yxvkvkkn3sixeuxv3ha4z94d',
                "client_secret": '2EG7sOFjI5wrevOHMOE3ZEWL'
            };
            console.log("BODY JSON -> " + JSON.stringify(body));
            console.log("BODY DECODED ARGS -> " + JSON.stringify(body));
								const data = JSON.stringify(body)

								const options = {
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
								  res.on('data', (d) => {
									process.stdout.write(d)
								  })
								}) 

								req2.on('error', (error) => {
								  console.error(error)
								})
                                console.log("RESPOSTA DO REQUEST -> " + req2.body);
								req2.write(data);
								req2.end();
            logData(req);
			res.status(200).send('Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
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