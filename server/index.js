require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cookieParser());
app.use(cors(
    {
        credentials: true,
        origin: process.env.CLIENT_URL
    }
));
app.use(express.json());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT: ${PORT}`));
    } catch (error) {
        console.log(error)
    }
}

start()

