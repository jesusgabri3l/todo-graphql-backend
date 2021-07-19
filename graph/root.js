const {updateUser} = require('../controllers/users/userController');
const {tryLogin} = require('../controllers/auth/login/loginController');
const {tryRegister} = require('../controllers/auth/register/registerController');
const {newTask, tasksByUserID, updateTaskStatus} = require('../controllers/tasks/taskController');

// The root provides a resolver function for each API endpoint
const root = {
    login: ({input}) => tryLogin(input),
    register: ({input}) => tryRegister(input),
    updateUser: ({input}) => updateUser(input),
    tasksByUser: (userID) => tasksByUserID(userID),
    newTask: ({task}) => newTask(task),
    updateTaskStatus: (data) => updateTaskStatus(data)
  };

module.exports = root;