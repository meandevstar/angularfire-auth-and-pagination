const functions = require('firebase-functions');
const admin = require('firebase-admin');
const util = require('util');

const db = admin.firestore();


const writeCollectionInfo = (event) => {
  const { tokenId } = event.params;
  const rootTableInfoRef = db.collection('tableInfo');

  // Setting id (only when creation)
  if (event.data.exists) {
    event.data.ref.set({ id: event.data.ref.id }, { merge: true });
  }

  if (tokenId) {
    return db.collection('tokens').get().then(tokens => {
      const payload = {
        counts: tokens.docs.length
      };
      return rootTableInfoRef.doc('tokens').set(payload, { merge: true });
    });
  } else {
    return Promise.resolve();
  }
};

const handleCors = function (res) {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
  });
};

const createError = function (type, msg) {
  let error = new Error(msg || '');

  switch (type) {
    case 'BAD_REQUEST':
      error.name = 'Bad Request';
      error.status = 400;
      break;

    case 'UNAUTHORIZED':
      error.name = 'Unauthorized';
      error.status = 401;
      break;

    case 'SERVER_ERROR':
      error.name = 'Internal Server Error';
      error.status = 500;
      break;

    default:
      error.name = 'Internal Server Error';
      error.status = 500;
      error.message = 'An Error occurred';
  }

  return error;
}

module.exports = {
  handleCors: handleCors,
  createError: createError,
  writeCollectionInfo: writeCollectionInfo
}
