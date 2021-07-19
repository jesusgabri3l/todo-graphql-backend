const client = require('../../../clientDB');
const schema = require('./registerValidation')
const {getUserByUserNameIfExists, createUser} = require('../../users/userController');
const uniqid = require('uniqid');

const tryRegister = async ({name, username, password}) => {
    const result = schema.validate({name, username, password})
    if (result.error) return {response: {status: 400, message: result.error.details[0].message}}

    const user = await getUserByUserNameIfExists(username)
    if (user) return {response: {status: 400, message: 'This username seems to be used, you might choose another one'}}

    const id = uniqid()
    const responseRegister = createUser({id, name, username, password})

    if(!responseRegister) return {response: {status: 500, message: 'Hey!, Looks like something went wrong'}}

     return {response: {status: 200, message: 'User registered successfully!'}, user: {id, name, username, password }}
}



module.exports = {tryRegister}