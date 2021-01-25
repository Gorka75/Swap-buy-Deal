import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyA-0CMc9_yiSCQA4HudUyZRaw3WFRhwv4Q",
    authDomain: "swap-buy-deal.firebaseapp.com",
    projectId: "swap-buy-deal",
    storageBucket: "swap-buy-deal.appspot.com",
    messagingSenderId: "869391260869",
    appId: "1:869391260869:web:739eb720f2d1d3346624ac",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);