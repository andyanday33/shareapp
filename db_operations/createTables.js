const sequelize = require('../middleware/sequelizeConnection');
const Portfolio = require('../models/Portfolio');
const Trdae = require('../models/Trade');

sequelize.sync({force:true}).then(() => {
    console.log("Database is in sync!");
    
}).catch((err) => console.error(err));