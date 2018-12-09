/*
 * Primary file for the API
 */

"use strict";

// Dependencies
var config = require("./config");
var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var fs = require("fs");


// The server should respond to all request with a string
var httpServer  = http.createServer(function (req, res) {
    uniServer(req, res);
});

// Start the server
httpServer.listen(config.httpPort, function () {
    console.log("The server is listening on port " + config.httpPort + " in " + config.envName + " mode");
});


// All the server logic for both the http and https modes
// I left this part as is but for homework purposes I'm using only http server
var uniServer = function (req, res) {
    // Get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get the http method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder("utf-8");
    var buffer = "";

    req.on("data", function (data) {
        buffer += decoder.write(data);
        console.log("Buffer new append: " + data + "\n");
    });

    req.on("end", function () {
        buffer += decoder.end();

        // Choose the handler this request should go to.
        // If one is not found, use the notFound handler.

        var chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            "trimmedPath" : trimmedPath,
            "queryStringObject" : queryStringObject,
            "method" : method,
            "headers" : headers,
            "payload" : buffer
        };

        // Route the request specified in the router
        chosenHandler(data, function (statusCode, payload) {

            // Use the status code called bach by the handler, or default to 200
            statusCode = typeof(statusCode) === "number" ? statusCode : 200;
            // Use the payload called back by the handler, or default by the empty object
            payload = typeof(payload) === "object" ? payload : {};

            var payloadString = JSON.stringify(payload);

            // Return the response

            // Send the response
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log("Returning this response", statusCode, payloadString);
        });

    });


    // --- Handlers and routes ---
    var handlers = {};

    // Ping handler
    handlers.ping = function(data, callback) {
        callback(200);
    };

    // Define not found handlers
    handlers.notFound = function (data, callback) {
        callback(404);
    };

    // Define a request router
    var router = {
        "ping": handlers.ping
    };

};
