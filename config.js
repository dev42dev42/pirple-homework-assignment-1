/*
 * Create and export configuration variables
 */

// Container for all the environments

var env = {};

// Staging (default) environment
env.test = {
    "httpPort" : 3000,
    "envName" : "test",
};

// Determine which environment was passed as a command line argument
var currentEnv = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV.toLowerCase() : "";


// Check that defined environment is one of defined above, if not, use default env
var envToExport = typeof (env[currentEnv]) === "object" ? env[currentEnv] : env.test;


// Export the module
module.exports = envToExport;