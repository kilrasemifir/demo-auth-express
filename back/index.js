/*
Demonstration de la mise en place d'une connexion avec Basic-Auth et Bearer-Auth.
*/
/**
 * Récupération d'express pour la création de route et d'un server HTTP.
 * Ce n'est pas un framework mais une librairie qui permet de créer un server HTTP.
 */
const express = require('express');


/**
 * PORT sur lequel le server HTTP va écouter.
 */
const PORT = 8000;

const app = express();
const keycloak = require('./keycloak.config').initKeycloak(app);
const demo = require('./produits.controller');
app.use(keycloak.middleware());

/**
 * Utilisation d'un middleware pour parser le body des requêtes.
 */
app.use(express.json());

app.use('/demo', demo);

/**
 * Lancement du server HTTP sur le port PORT.
 */
app.listen(PORT, ()=>{
    console.log(`Lancement du server sur le port ${PORT}`);
});