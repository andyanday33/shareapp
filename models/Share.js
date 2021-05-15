const { DataTypes, Model } = require('sequelize');
const sequelize = require('../middleware/sequelizeConnection');

class Share extends Model {}
Share.init({ 
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isUppercase: true,
            len: [3,3]
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rate: {
        type: DataTypes.INTEGER,
        validate:{
            len: [2,2]
        }
    },
    
},
    { sequelize });

module.exports = Share;
// Code to sync database after creating a new model
// sequelize.sync({force:true}).then(() => {
//     console.log("Database is in sync!");
    
// }).catch((err) => console.error(err));