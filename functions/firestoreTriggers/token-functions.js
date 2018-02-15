const functions = require('firebase-functions');
const admin = require('firebase-admin');
const helpers = require('../lib/helpers');

const db = admin.firestore();

exports.increaseTokenCount = functions.firestore
  .document('tokens/{tokenId}')
  .onCreate(helpers.writeCollectionInfo);

exports.decreaseTokenCount = functions.firestore
  .document('tokens/{tokenId}')
  .onDelete(helpers.writeCollectionInfo);