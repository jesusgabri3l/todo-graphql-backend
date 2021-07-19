const client = require("../../clientDB");
const {schemaUpdate} = require('./validations');

const createUser = async ({id, name, username, password}) => {
  return (async () => {    
    const query = {
        name: 'create-user',
        text: 'INSERT INTO users(id, name, username, password) VALUES($1, $2, $3, $4)',
        values: [id, name, username, password],
    }
    const { rows } = await client.query(query)
    if (rows.length > 0) return {id, name, username, password}
    return false
})().catch(err =>
    setImmediate(() => {
        throw err
    })
)
}

const updateUser = async (data) => {
  const {id, name, username} = data

  const result = schemaUpdate.validate({name, username})
  if (result.error) return {response: {status: 400, message: result.error.details[0].message}}

  const user = await getUserByIDIfExists(id);
  if(!user) return {response: {status: 404, message: 'Looks like your ID does not exists'}}

  if(user.username != username){
    const validateUserName = await getUserByUserNameIfExists(username)
    if(validateUserName) return {response: {status: 400, message: 'Looks like the username you are trying to use is already used!'}}
  }

  const responseUpdate = await queryUpdate(data)
  if(!responseUpdate) return {response: {stauts: 500, message: 'Something went wrong'}}

  return {response : {status: 200, message: 'Profile updated successfully'}, user: {...responseUpdate}}

}

const queryUpdate = async ({id, name, username}) => {

  return (async () => {    
    const query = {
        name: 'update-user',
        text: `UPDATE users 
        SET name = $1, username = $2 
        WHERE id = $3`,
        values: [name, username, id]
    }
    try{
        const response = await client.query(query)
        return true
    }catch(err){
        return false
    }
})().catch(err =>
    setImmediate(() => {
        throw err
    })
)
}

const getUserByUserNameIfExists = (username) => {
  if (username == null) return false
  return (async () => {
      const query = {
          name: 'fetch-user-by-usernamename',
          text: 'SELECT * FROM users WHERE username = $1',
          values: [username],
      }
      const { rows } = await client.query(query)
      if (rows.length > 0) return rows[0]
      return false
  })().catch(err =>
      setImmediate(() => {
          throw err
      })
  )
}

const getUserByIDIfExists = (id) => {
  if (id == null) return false
  return (async () => {
      const query = {
          name: 'fetch-user-by-id',
          text: 'SELECT * FROM users WHERE id = $1',
          values: [id],
      }
      const { rows } = await client.query(query)
      if (rows.length > 0) return rows[0]
      return false
  })().catch(err =>
      setImmediate(() => {
          throw err
      })
  )
}


module.exports = { createUser, getUserByUserNameIfExists, updateUser, getUserByIDIfExists}
