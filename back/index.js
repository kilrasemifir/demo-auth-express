const express = require('express');
const crypto = require('crypto');

const users = [];

const app = express();

app.use(express.json());

const hash = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
}

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

app.get("/basic-auth", (req, res)=>{
    const authorization = req.headers["authorization"].substring(6);
    const pair = Buffer.from(authorization, 'base64').toString('utf-8')
    console.log(pair);
    let [username, password] = pair.split(":")
    const hashPassword = hash(password) 
    if (users.some(user=>user.username === username && user.password === hashPassword)){
        res.send("OK")
    }
    else {
        res.send("Erreur").status(403)
    }
})

app.listen(8000, ()=>{
    console.log("Lancement du server sur le port 8000");
});