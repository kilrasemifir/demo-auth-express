const express = require('express');
const router = express.Router();

router.get('/anonymes', (req, res) => {
    res.send('Les anonymes peuvent voir cela!');
});

router.get('/authentifies', (req, res) => {
    res.send('Les authentifies peuvent voir cela!');
});

router.get('/user', (req, res) => { 
    res.send('Les users peuvent voir cela!');
});

router.get('/admin', (req, res) => {
    res.send('Les admins peuvent voir cela!');
});

module.exports = router;