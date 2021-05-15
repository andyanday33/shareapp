const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://andyanday:testing1212@db-evatestcase.c32nipurm87g.us-east-1.rds.amazonaws.com:5432/evatestcasedb');

module.exports = sequelize;