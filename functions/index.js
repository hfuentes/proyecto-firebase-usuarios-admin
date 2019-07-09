// Funciones REST API para interectuar con la base de datos de juegadores

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
app.use(express.json());

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

    let token = {
        token: 'nada de nada ...'
    };
    res.status(200).send(token);
});

// Inserta o reemplaza registro de juagador
app.post('/jugador', async (req, res) => {
    const jugador = req.body.jugador;
    const snapshot = await admin.database().ref(`/datos-juego/jugadores/${jugador.username}`).push({
        nombre: jugador.nombre,
        nivel: jugador.nivel
    });
    const val = snapshot.val();
    res.status(201).json({
        respuesta: "OK",
        mensaje: val.message,
        jugador: jugador
    });
});

app.get('/jugadores', async (req, res) => {
    const data = await admin.database().ref(`/datos-juego/jugadores`).once('value');
    res.status(201).json({
        respuesta: "OK",
        jugadores: data
    });
});

// Metodo de prueba para obtener version API
app.get('/version', async (req, res) => {
    res.status(200).send({
        respuesta: "OK",
        version: "1.0"
    });
});

exports.api = functions.https.onRequest(app);