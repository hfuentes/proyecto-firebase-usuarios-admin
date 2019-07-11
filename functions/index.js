// REST API para interectuar con la base de datos de jugadores

'use strict';

const express = require('express');
const app = express();
app.use(express.json());

const functions = require('firebase-functions');
const key = require('./firebase-key');
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(key),
    databaseURL: "https://base-usuarios-admin.firebaseio.com"
});

const refDatosJuego = admin.database().ref("datos-juego");
const jugadoresRef = refDatosJuego.child("jugadores");

// Metodo para verficar token autorizacion
const authenticate = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedIdToken;
        next();
        return;
    } catch (e) {
        res.status(403).send('Unauthorized');
        return;
    }
};
//app.use(authenticate);

// Metodos REST API

// Metodo para obtener version API
app.get('/version', async (req, res) => {
    res.status(200).send({
        respuesta: "OK",
        version: "1.0"
    });
});

// Metodo para obtener token de sesion
app.get('/token', async (req, res) => {
    /*admin.auth().signInWithEmailAndPassword('hectorfuentesg@gmail.com', '123456a').catch(function (err) {
        console.log("--------------------------------------------");
        console.log("--------------------------------------------");
        console.log("--------------------------------------------");
        console.log(err);
        console.log("--------------------------------------------");
        console.log("--------------------------------------------");
        console.log("--------------------------------------------");
    });*/

    /*firebase.auth().signInWithEmailAndPassword('hectorfuentesg@gmail.com', '123456a').then(rs=>{

    }).catch(err=>{});*/
    /*firebase.auth().signInWithEmailAndPassword('hectorfuentesg@gmail.com', '123456a').catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });*/
    /*admin.auth().getUserByEmail('hectorfuentesg@gmail.com').then(data => {
        console.dir(data);
    }, err => console.dir(err)).catch(err => {
        console.dir(err);
    });*/
    let token = {
        resultado: "OK",
        token: key
    };
    res.status(200).send(token);
});

// Inserta o reemplaza registro de jugador
app.post('/jugador', async (req, res) => {
    console.log("POST /api/jugador");
    console.log(req.body);
    let ref = jugadoresRef.child(req.body.username);
    ref.set({
        nombre: req.body.nombre,
        nivel: req.body.nivel
    }, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                respuesta: "ERROR",
                error: err
            });
        } else {
            console.log(req.body)
            res.status(201).send({
                respuesta: "OK"
            });
        }
    });
});

// Metodo para obtener lista completa de jugadores
app.get('/jugadores', async (req, res) => {
    const data = await admin.database().ref(`/datos-juego/jugadores`).once('value');
    res.status(201).json({
        respuesta: "OK",
        jugadores: data
    });
});

exports.api = functions.https.onRequest(app);