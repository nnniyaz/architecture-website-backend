const jwt = require('jsonwebtoken');
const db = require('../db');
const { Token } = require('../models/models');

class TokenService {
    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, '' + process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, '' + process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { user_id: userId } });
        if (tokenData) {
            tokenData.refresh_token = refreshToken;
            await tokenData.save();
            return tokenData;
        }
        const newToken = await Token.create({ refresh_token: refreshToken, user_id: userId })
        console.log(newToken)
        return newToken;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({ where: { refresh_token: refreshToken } });
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({ where: { refresh_token: refreshToken } });
        return tokenData;
    }
}

module.exports = new TokenService();