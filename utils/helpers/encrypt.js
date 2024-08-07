const bcrypt = require('bcrypt');
module.exports = {
    hash: function (password) {
        return bcrypt.hashSync(password, Number(process.env.ROUND));
    },
    compare: function (password, passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }
};