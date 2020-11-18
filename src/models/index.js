
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/db.config')
const db = {}

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  config.options
)

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach((file) => {
    
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

// db.User.hasMany(db.Account)
// db.Account.belongsTo(db.User)

module.exports = db