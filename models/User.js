const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../middleware/sequelizeConnection');

const encryptPasswords = async (users) => {
    
    await Promise.all(users.map(async (user) => {
        const salt = await bcrypt.genSalt();
        user.dataValues.password = await bcrypt.hash(user.dataValues.password, salt);
    }));
    
}

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
        beforeCreate: async (user, options) => {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
        },
        afterCreate: (user, options) => {
            console.log("New User was created!");
        },
        beforeBulkCreate: async (users, options) => {
           
            await encryptPasswords(users);
            
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