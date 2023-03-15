const express = require('express');
const router = express.Router();
const keycloak = require('./keycloak.config').getKeycloak();

const HAS_USER_ROLE = keycloak.protect('user');

router.use(HAS_USER_ROLE);

router.get('/anonymes', (req, res) => {
    res.send('Les anonymes peuvent voir cela!');
});

router.get('/authentifies', keycloak.protect() ,(req, res) => {
    res.send('Les authentifies peuvent voir cela!');
});

router.get('/user', HAS_USER_ROLE, (req, res) => { 
    res.send('Les users peuvent voir cela!');
});

router.get('/admin', keycloak.protect(['admin','user']), (req, res) => {
    res.send('Les admins peuvent voir cela!');
});

module.exports = router;