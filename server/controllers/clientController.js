const { validationResult } = require("express-validator");
const { Client } = require("../models/models");

class ClientController {
    async createClient(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { name, email, message } = req.body;
            const newClient = await Client.create({
                name, email, message
            });
            return res.json(newClient);
        } catch (error) {
            next(error);
        }
    }

    async getAllClients(req, res, next) {
        try {
            const clients = await Client.findAll();
            return res.json(clients);
        } catch (error) {
            next(error);
        }
    }

    async deleteClient(req, res, next) {
        try {
            const id = req.body.id;
            const client = await Client.destroy({ where: { id: id } });
            return res.json(client);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ClientController();