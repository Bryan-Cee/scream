const functions = require('firebase-functions');
const firebase = require('firebase');
const app = require('express')();
const config = require("./utils/config");
const { getAllScreams, postScream } = require("./handlers/screams");
const { signUp, login } = require("./handlers/users");
const { AuthMiddleware } = require("./utils/auth");

firebase.initializeApp(config);

//Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', AuthMiddleware, postScream);

//User routes
app.post('/signup',  signUp);
app.post('/login', login);

exports.api = functions.region("europe-west2").https.onRequest(app);