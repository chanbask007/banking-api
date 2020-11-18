
module.exports = (sequelize,DataTypes) =>{
    const Account = sequelize.define('Account',{
        userEmail:{
            type: DataTypes.STRING  
            
        },
        transactionType: {
            type: DataTypes.STRING
        },
        transactionAmount:{
            type: DataTypes.DOUBLE
        }
    })

    return Account
}