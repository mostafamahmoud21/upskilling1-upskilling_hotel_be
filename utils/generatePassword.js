const crypto = require('crypto');

 exports.generatePassword=()=>{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for(let i=0;i<10;i++){
        const randomnum=crypto.randomInt(0,characters.length)
        password+=characters[randomnum]
    }
    return password
}

