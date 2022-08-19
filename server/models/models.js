const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    is_activated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activation_link: { type: DataTypes.STRING },
    reset_link: { type: DataTypes.STRING, defaultValue: '' },
})

const Token = sequelize.define('token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refresh_token: { type: DataTypes.STRING(7000) },
    user_id: { type: DataTypes.INTEGER }
})

const Client = sequelize.define('client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    message: { type: DataTypes.STRING }
})

Token.belongsTo(User, {
    foreignKey: 'user_id'
})

module.exports = {
    User,
    Token,
    Client
}