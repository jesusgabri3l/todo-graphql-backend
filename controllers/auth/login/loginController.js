const schema = require('./loginValidation')
const {getUserByUserNameIfExists} = require('../../users/userController');

const tryLogin = async ({username, password}) => {

    const result = schema.validate({username, password})
    if (result.error) return {response: {status: 400, message: result.error.details[0].message}}

    const user = await getUserByUserNameIfExists(username)
    if (!user) return {response: {status: 404, message: 'This username does not exist, you might not be register'}}

    if(password != user.password) return {response : {status : 403, message: 'Looks like your password is not valid'}}

    return {response : {status: 200, message: 'Logged in!'}, user : {
        id: user.id,
        username: user.username,
        name: user.name
    }}
}

module.exports = {tryLogin}