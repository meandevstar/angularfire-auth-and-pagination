const functions = require('firebase-functions');
const admin = require('firebase-admin');
const env = require('./env')();

const serviceAccount = require('./service-account.json');
const databaseURL = 'https://test-c3aa1.firebaseio.com';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

const tokenStoreTriggers = require('./firestoreTriggers/token-functions');
const userHttpTriggers = require('./httpTriggers/user-functions');


//=====================================================================
// FIRESTORE TRIGGERS
//=====================================================================

exports.increaseTokenCount = tokenStoreTriggers.increaseTokenCount;
exports.decreaseTokenCount = tokenStoreTriggers.decreaseTokenCount;


//=====================================================================
// HTTP TRIGGERS
//=====================================================================

exports.getUserToken = userHttpTriggers.getUserToken;
exports.createAccount = userHttpTriggers.createAccount;
exports.checkAccount = userHttpTriggers.checkAccount;










