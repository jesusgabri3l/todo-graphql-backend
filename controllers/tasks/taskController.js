const schema = require('./validation');
const {getUserByIDIfExists} = require('../users/userController');
const client = require('../../clientDB');
const uniqid = require('uniqid')

const newTask = async (task) => {
    const {title, description, userID} = task

    const result = schema.validate({title, description})
    if (result.error) return {response: {status: 400, message: result.error.details[0].message}}

    const user = await getUserByIDIfExists(userID)
    if(!user) return {response: {status: 400, message: 'This user ID does not exist'}}

    const response = await addNewTaskQuery({id: uniqid(), ...task})
    if(!response) return {response: {status: 500, message: 'Something went wrong'}}
    return {response: {status: 200, message: 'Task created successfully!'}, task:{...response}}
}

const addNewTaskQuery = async ({id, title, description, userID}) => {
    return (async () => {    
      const query = {
          name: 'new-task',
          text: 'INSERT INTO tasks(id, title, description, userID) VALUES($1, $2, $3, $4)',
          values: [id, title, description, userID],
      }
      try{
        const { rows } = await client.query(query)
        return {id, title, description, userID}
      }catch(e){
        return false
      }
  })().catch(err =>
      setImmediate(() => {
          throw err
      })
  )
  }

  const tasksByUserID = async ({userID}) => {

    const user = await getUserByIDIfExists(userID)
    if(!user) return {response: {status: 400, message: 'This user ID does not exist'}}

    const tasks = await tasksByUserQuery(userID)
    if(!tasks) return {response: {status: 500, message: 'Something went wrong'}}
    return {response: {status:200, message : 'Success!'}, tasks: [...tasks]}
    
  }

  const tasksByUserQuery = async (userID) => {
    return (async () => {    
      const query = {
          name: 'tasks-user',
          text: 'SELECT * FROM tasks WHERE userid = $1 and status != 4',
          values: [userID]
      }
      try{
        const { rows } = await client.query(query)
        return rows
      }catch(e){
        return false
      }
  })().catch(err =>
      setImmediate(() => {
          throw err
      })
  )
  }

  const taskByID = async (id) => {
    console.log(id)
    return (async () => {    
      const query = {
          name: 'tasks-id',
          text: 'SELECT * FROM tasks WHERE id = $1',
          values: [id]
      }
      try{
        const { rows } = await client.query(query)
        return rows[0]
      }catch(e){
        return false
      }
  })().catch(err =>
      setImmediate(() => {
          throw err
      })
  )
  }

  const updateTaskStatus = async ({id, status}) => {
    
    const task = await taskByID(id)
    if(!task) return { response: {status: 404, message: 'This task id was not found' }}
    const response = await updateTaskStatusQuery(id, status)
    if(!response) return { response: {status: 500, message: 'Internal error'}}
    return { response: {status: 200, message: 'Status updated successfully!'}, task: {status, ...task}}
  }

  const updateTaskStatusQuery = async (id, status) => {
    return (async () => {    
      const query = {
          name: 'update-task-status',
          text: `UPDATE tasks 
          SET status = $1
          WHERE id = $2`,
          values: [status, id]
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

module.exports = {newTask, tasksByUserID, updateTaskStatus}