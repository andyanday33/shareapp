const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../middleware/sequelizeConnection');

class User extends Model {
    static async login(username, password){
        const res = await this.findAll({
            where: {
                userName: username
            }
        });
        if(typeof res[0] !== "undefined"){ //if a value has returned
            const user = res[0].dataValues;
            const auth = await bcrypt.compare(password, user.password);
            if (auth){
                return user
            }
            throw Error('Password is incorrect');
        }
        throw Error('Incorrect Username');
    }
}
User.init({
    userName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // Model attributes are defined here
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6,128] //length of the password
        }
    }
}, {
    hooks: {
        beforeCreate: (user, options) => {
            user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
        },
        afterCreate: (user, options) => {
            console.log("New User was created!");
        }
    },
    sequelize
}
);


//console.log(User === sequelize.models.User);



//Code to sync database after creating a new model
// sequelize.sync({force:true}).then(() => {
//     console.log("Database is in sync!");
    
// }).catch((err) => console.error(err));

module.exports = User