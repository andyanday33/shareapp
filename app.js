const express = require('express');
const { Sequelize } = require('sequelize');
const CookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const protectedRoutes = require('./routes/protectedRoutes');
const { requireAuth } = require('./middleware/authMiddleware');


const app = express();

const port = 8080;

//middleware
app.use(express.json());
app.use(CookieParser());
//app.use(cookieParser());
require('dotenv').config();
const sequelize = new Sequelize(process.env.db_string);

app.listen(port);


app.get('/', (req, res) => {
    console.log("Hello world!");
    res.json({data: "Hello World!"});
})

app.use(routes);

app.get('/protected', requireAuth, (req, res) => {
    res.json({data: "Welcome to the protected route"});
})

app.use(protectedRoutes);