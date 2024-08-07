const { DataTypes } = require('sequelize');
const sequelize = require('../config/DataBase.js');
const encrypt = require('../utils/helpers/encrypt.js');

sequelize.sync();

const Account = sequelize.define('account', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', encrypt.hash(value));
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active',
    },
    role: {
        type: DataTypes.ENUM('Admin', 'User'),
        defaultValue: 'User',
    },
    verified: {
        type:DataTypes.BOOLEAN,
        defaultValue: false
    },
    refreshToken: DataTypes.STRING,
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Account;