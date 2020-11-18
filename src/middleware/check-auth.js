const jwt = require('jsonwebtoken');

module.exports= (req,res,next)=>{

    try{    
        
        const token= req.headers.authorization.split(" ")[2];
        // console.log(token);
        const decoded= jwt.verify(token, process.env.JWT_KEY|| 'secret');
        // console.log(token)
        req.userData=decoded;
        next()
    }
    catch(err){
            return res.status(401).json({
                message: 'Auth Failed.!'
            })
    }

    
}