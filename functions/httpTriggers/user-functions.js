const admin = require('firebase-admin');
const functions = require('firebase-functions');
const helpers = require('../lib/helpers');
const userFunctions = require('../lib/user-functions');

const firestore = admin.firestore();


/**
 * Get user token
 */

exports.getUserToken = functions.https.onRequest((req, res) => {
    helpers.handleCors(res);

    var uid = req.query.uid;
    if (!uid) {
        res.send(helpers.createError('BAD_REQUEST', 'User Id is missing'));
    } else {
        userFunctions.createToken(uid)
            .then(token => res.send({token}))
            .catch(err => res.send(err));
    }
});

/**
 * Create account
 */

exports.createAccount = functions.https.onRequest((req, res) => {
    helpers.handleCors(res);

    const email = req.query.email;
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;


    if (!email) {
        res.send(helpers.createError('BAD_REQUEST', 'Email is missing'));
    } else if (!firstName || !lastName) {
        res.send(helpers.createError('BAD_REQUEST', 'Name is missing'));
    } else {
        const payload = { email, firstName, lastName };
        userFunctions.createAccount(payload)
            .then(token => {
                if (token) {
                    res.send({token});
                } else {
                    res.send(helpers.createError('BAD_REQUEST', 'Email already registered'));
                }
            });
    }
});


/**
 * Check if user account exists, and email verification status, by email
 */

exports.checkAccount = functions.https.onRequest((req, res) => {
    helpers.handleCors(res);

    const email = req.query.email;

    if (!email) {
        res.send(helpers.createError('BAD_REQUEST', 'Email is missing'));
    } else {
        userFunctions.findUserByEmail(email)
            .then(result => res.send(result))
            .catch(err => res.send(err));
    }
});