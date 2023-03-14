const crypto = require('crypto');

const password = "changeme";
const salt = "54654f6qsf4d6q4dq6sf";

const hash = crypto.createHash('sha256')
                    .update(password)
                    .update(salt)
                    .digest('hex');

console.log(hash)