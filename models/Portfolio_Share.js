const { DataTypes, Model } = require('sequelize');
const sequelize = require('../middleware/sequelizeConnection');


const Portfolio_Share = sequelize.define('Portfolio_Share', {
    amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
});

module.exports = Portfolio_Share;