/*
Demonstration de la mise en place d'une connexion avec Basic-Auth et Bearer-Auth.
*/
/**
 * Récupération d'express pour la création de route et d'un server HTTP.
 * Ce n'est pas un framework mais une librairie qui permet de créer un server HTTP.
 */
const express = require('express');
/**
 * Récupération de crypto pour le hashage des mots de passe.
 * C'est une librairie standard de nodejs.
 */
const crypto = require('crypto');
/**
 * Récupération de jsonwebtoken pour la création de token JWT.
 * C'est une librairie à importer avec npm.
 */
const jwt = require('jsonwebtoken');

/**
 * Secret pour la création de token JWT.
 * Il ne DOIT JAMAIS être partagé avec qui que ce soit.
 * Il permet de signer le token et de le vérifier. Ainsi, seul cette application
 * peut créer et vérifier les tokens.
 */
const SECRET = 'azerty';
/**
 * PORT sur lequel le server HTTP va écouter.
 */
const PORT = 8000;

/**
 * Mock d'une base de données en utilisant une liste.
 * Ce n'est pas une bonne solution! Mais permet de ne pas avoir a configurer
 * la connexion et les requêtes à une base de données.
 * 
 * On initialise la liste avec un utilisateur.
 */
const users = [
    {
        username: 'toto',
        password: '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86'    
    }
];

/**
 * Création d'un server HTTP avec express.
 */
const app = express();

/**
 * Utilisation d'un middleware pour parser le body des requêtes.
 */
app.use(express.json());

/**
 * Hash d'une chaine de caractère avec le hashage SHA256.
 * @param {string} data la chaine de caractère à hasher
 * @returns le hash de la chaine de caractère
 */
const hash = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Trouve l'utilisateur s'il existe dans la liste des utilisateurs.
 * @param {string} username de l'utilisateur
 * @param {string} password de l'utilisateur en clair
 */
const findUser = (username, password)=>{
    const hashPassword = hash(password); 
    return users.find(user=>user.username === username 
        && user.password === hashPassword)
}

/**
 * Verifie le token JWT et passe à la route suivante si le token est valide.
 * Sinon, retourne une erreur 403.
 * @param {Request} req requête HTTP
 * @param {Response} res réponse HTTP
 * @param {any} next fonction pour passer à la route suivante
 */
const verifyToken = (req, res, next)=>{
    const token = req.headers["authorization"].substring(7);
    try{
        const decode = jwt.verify(token, SECRET);
        next();
    } catch(err){
        res.send("Invalide").status(403)
    }
}

/**
 * Enregistrement d'un utilisateur
 */
app.post("/register", (req, res)=>{
    const dto = req.body;
    if (!dto.username){
        res.send("Vous devez donner un username").status(400);
    } 
    else if (!dto.password){
        res.send("Vous devez donner un mot de passe").status(400);
    }
    else if (users.some(usr=>usr.username === dto.username)){
        res.send("Un utilisateur possede deja ce username").status(400);
    }
    else {
        users.push({
            ...dto,
            password: hash(dto.password) // IMPORTANT: hash du mot de passe!
        });
        console.log(users);
        res.send("OK")
    }
});

/**
 * Exemple de route avec basic-auth.
 * Ce n'est qu'un exemple sur une seul route.
 * Cette route est accessible uniquement si l'utilisateur fournit un username et un mot de passe
 * en utilisant la méthode HTTP Basic-Auth.
 */
app.get("/basic-auth", (req, res)=>{
    const authorization = req.headers["authorization"].substring(6);
    const pair = Buffer.from(authorization, 'base64').toString('utf-8')
    console.log(pair);
    let [username, password] = pair.split(":");
    if (findUser(username, password)){
        res.send("OK")
    }
    else {
        res.send("Erreur").status(403)
    }
});

/**
 * Exemple de route avec bearer-auth pour la création d'un token JWT.
 * Le body de la requête doit contenir un username et un mot de passe (password).
 */
app.post("/jwt/signin", (req, res)=>{
    const dto = req.body;
    const usr = findUser(dto.username, dto.password);
    console.log(usr, dto);
    if (!usr){
        res.send("Aucun utilisateur ne possede ces credentials").status(403);
    } else {
        const token = jwt.sign({
            username: dto.username,
            prop: "Une autre information sur l'utilsiateur"
        }, SECRET);
        res.send(token);
    }
})

/**
 * Exemple de route avec bearer-auth pour la vérification d'un token JWT.
 * Ce n'est qu'un exemple sur une seul route. Il faut vérifier le token à chaque requête
 * sur les routes qui necessitent une authentification.
 */
app.get("/jwt", verifyToken, (req, res)=>{
    res.send("OK");
});

/**
 * Lancement du server HTTP sur le port PORT.
 */
app.listen(PORT, ()=>{
    console.log("Lancement du server sur le port PORT");
});