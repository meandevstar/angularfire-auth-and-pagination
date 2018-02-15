const admin = require("firebase-admin");
const firestore = admin.firestore();


const createToken = function (uid) {
    return admin.auth().createCustomToken(uid);
}

const createAccount = function (cred) {

    return firestore.collection('users')
        .where('email', '==', cred.email)
        .get()
        .then(snap => {

            if (snap.size > 0) {
                return null;
            } else {
                const userPayload = {
                    email: cred.email,
                    displayName: `${cred.firstName} ${cred.lastName}`
                };

                return admin.auth().createUser(userPayload)
                    .then(userRecord => userRecord.uid)
                    .then(uid => 
                        firestore.collection('users')
                            .doc(uid)
                            .set({
                                email: userPayload.email,
                                status: 'PENDING',
                                type: 'USER',
                                firstName: cred.firstName,
                                lastName: cred.lastName
                            })
                            .then(() => uid)
                    )
                    .then(uid => createToken(uid));
            }
        });
}

const findUserByEmail = function (email) {
    return new Promise(resolve => {
        admin.auth().getUserByEmail(email)
            .then((snap) => {
                const userData = snap.toJSON();

                if (userData.emailVerified) {
                    if (userData.phoneNumber) {
                        resolve({
                            token: null,
                            isAccountExists: true,
                            isEmailVerified: true,
                            phoneNumber: userData.phoneNumber
                        });
                    } else {
                        // verification email sent
                        createToken(userData.uid)
                            .then(token => {
                                resolve({
                                    token: token,
                                    isAccountExists: true,
                                    isEmailVerified: true
                                });
                            });
                    }
                } else {
                    resolve();
                }
            })
            .catch(err => resolve());
    })
    
    .then(result => {
        if (result) {
            return result;
        } else {
            return firestore.collection('users')
                .where('email', '==', email)
                .get()
                .then(snap => {
                    if (snap.size > 0) {
                        const uid = snap.docs[0].id;
                        // verification email sent
                        return createToken(uid)
                            .then(token => {
                                return {
                                    token: token,
                                    isAccountExists: true,
                                    isEmailVerified: false
                                };
                            });
                    } else {
                        // user not registered
                        return {
                            token: null,
                            isAccountExists: false,
                            isEmailVerified: false
                        };
                    }
                });
        }
    });
}


module.exports = {
    createToken: createToken,
    createAccount: createAccount,
    findUserByEmail: findUserByEmail
};