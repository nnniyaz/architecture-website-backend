const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserDto = require('../dto/userDto');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const db = require('../db');
const ApiError = require('../exceptions/ApiError');
const { User } = require('../models/models');

class UserService {
    async registration(email, password, name, surname) {
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с таким почтовым адресом (${candidate.email}) уже существует`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const userRole = 'USER';
        const activationLink = uuid.v4();

        const newUser = await User.create({
            name, surname, email, password: hashPassword, role: userRole, activation_link: activationLink
        })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

        const userDto = new UserDto(newUser);
        const tokens = await tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async activate(activationLink) {
        const user = await User.findOne({ where: { activation_link: activationLink } });
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.is_activated = true;
        user.save();
        return user;
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findOne({ where: { id: userData.id } });
        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }

    async getAllUsers() {
        const users = await User.findAll();
        return users;
    }
}

module.exports = new UserService();