module.exports = {
    HOST: "localhost",
    USER: "chanbas",
    PASSWORD: "chanbas",
    options:{
      dialect: "mysql"
    },
    DB: "banking",
    
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    authentication:{
        jwtSecret: process.env.JWT_SECRET || 'secret'
    }
  };