import { firebase } from './core';

const google = new firebase.auth.GoogleAuthProvider(); //Вход через сервис Google

export function logUserOut() {
    return firebase.auth().signOut();
}

export function loginWithGoogle() {
    return firebase.auth().signInWithPopup(google).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
        console.log('token ', token);        
        // The signed-in user info.
        let user = result.user;
        console.log('user ', user);
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('errorMessage ', errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
}

export function getFirebaseUser() {
    return new Promise(resolve => firebase.auth().onAuthStateChanged(user => resolve(user)));
}

export function getFirebaseToken() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
        return Promise.resolve(null);
    }
    return currentUser.getIdToken(true);
}
