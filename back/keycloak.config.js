const session = require('express-session');
const Keycloak = require('keycloak-connect');

let _keycloak;

const keycloakConfig = {
    clientId: 'backend-secu',
    credenials: {
        secret: process.env.KEYCLOAK_SECRET||'RVXTJYBRPb8UpKKqp6LuZHNTUGbcdPk5',
    },
    realm: 'demosecu',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080/auth',
};

/**
 * Initialisation du client keycloak.
 * @returns {Keycloak} une instance du client keycloak
 */
const initKeycloak = (app) => {
    if (_keycloak){
        console.warn('Keycloak est deja initialise');
        return _keycloak;
    }
    console.log("Initialisation de Keycloak");
    const memoryStore = new session.MemoryStore();
    app.use(session({
        secret: 'mySecret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    }));
    _keycloak = new Keycloak({store: memoryStore}, keycloakConfig);
    return _keycloak;
};

const getKeycloak = () => {
    if (!_keycloak){
        console.error('Keycloak n\'a pas ete initialise');
        throw 'Keycloak n\'a pas ete initialise';
    }
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak,
};