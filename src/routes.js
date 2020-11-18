const checkAuth= require('../src/middleware/check-auth');
const { accounts } = require('./controllers/AuthenticationController');


const AuthenticationController = require('./controllers/AuthenticationController')

module.exports = (app) =>{
    app.post('/register',AuthenticationController.register)
    app.post('/login',AuthenticationController.login)
    app.post('/transaction',checkAuth,AuthenticationController.makeTransaction)
    app.post('/accounts',checkAuth,AuthenticationController.accounts)
    app.get('/users', checkAuth,AuthenticationController.users)
    app.get('/users/:userId', checkAuth,AuthenticationController.userId)
}

