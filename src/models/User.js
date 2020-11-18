
module.exports = (sequelize,DataTypes) =>{
    const User = sequelize.define('User',{
        email:{
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true

        },
        password:{
            type: DataTypes.STRING
        },
        role:{
            type: DataTypes.STRING
        },
        balance:{
            type: DataTypes.DOUBLE
        }
    })
    

    return User
}
