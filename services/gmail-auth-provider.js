var fs = require('fs'),
    readline = require('readline'),
    googleAuth = require('google-auth-library'),
    q = require('q'),
    config = require('../config'),
    path = require('path');

var authProvider = function() {
  var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'],
  TOKEN_DIR = path.join( (process.env.HOME || process.env.USERPROFILE), '.credentials'),
  TOKEN_PATH = path.join( TOKEN_DIR, 'gmail-api-quickstart.json'),
  oauth2Client = null,
  TOKEN_NOT_SET = true;

  var service = {
    authenticate: authenticate
  }

  return service;

  function initialize() {
    var deferred = q.defer();
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        deferred.reject('Error loading client secret file: ' + err);
      } else {
        // Authorize a client with the loaded credentials, then call the Gmail API.
        deferred.resolve(JSON.parse(content));
      }
    });
    return deferred.promise;
  }

  function authenticate() {
    var deferred = q.defer();
    if (oauth2Client) {
      console.log('Authenticating GMail');
      return doAuthenticate(oauth2Client);
    } else {
      console.log('Fetching GMail API configuration...');
      return initialize().then(function(credentials) {
        var clientSecret = credentials.installed.client_secret,
            clientId = credentials.installed.client_id,
            redirectUrl = credentials.installed.redirect_uris[0],
            auth = new googleAuth();
        oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        return doAuthenticate(oauth2Client);
      });
    }
  }

  function doAuthenticate(oauth2Client) {
    var deferred = q.defer();
    if (TOKEN_NOT_SET && !(config.tokenSaved === 'true')) {
      console.log('Configured to extract token from Google.');
      // Check if we have previously stored a token.
      return getNewToken(oauth2Client);
    } else if (TOKEN_NOT_SET && (config.tokenSaved === 'true')) {
      console.log('Configured to extract token from the file. Trying to extract the token from it.');
      var deferred = q.defer();
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
          deferred.reject('Unable to read token from the file.');
        } else {
          oauth2Client.credentials = JSON.parse(token);
          TOKEN_NOT_SET = false;
          deferred.resolve(oauth2Client);
        }
      });
      return deferred.promise;
    } else {
      console.log('Extracting token from cache.');
      setTimeout(function() {
        deferred.resolve(oauth2Client);
      }, 1);
      return deferred.promise;
    }
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  function getNewToken(oauth2Client) {
    var deferred = q.defer();
    var authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          deferred.reject('Error while trying to retrieve access token', err);
        } else {
          oauth2Client.credentials = token;
          storeToken(token);
          TOKEN_NOT_SET = false;
          deferred.resolve(oauth2Client);
        }
      });
    });
    return deferred.promise;
  }

  /**
   * Store token to disk be used in later program executions.
   * @param {Object} token The token to store to disk.
   */
  function storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  }

};

module.exports = authProvider();