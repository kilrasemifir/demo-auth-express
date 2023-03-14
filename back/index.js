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
    else if (users.any(usr=>usr.username === dto.username)){
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
})

app.listen(8000, ()=>{
    console.log("Lancement du server sur le port 8000");
});