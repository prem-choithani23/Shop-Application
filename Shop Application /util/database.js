const {Sequelize} = require('sequelize')

// Instantiate sqlize
const sequelize = new Sequelize('node_complete' , 'prem' , 'Prem@13579' ,{
    dialect: 'mysql',
    host: 'localhost',
})

module.exports = sequelize
