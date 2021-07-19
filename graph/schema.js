const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type User{
    id: ID!
    name: String!
    username: String!
    password: String!
  }
  type Task{
    id: ID!
    title: String!
    description: String!
    status: Int!
    userID: ID!
  }
  type Response{
    status: Int!
    message: String
  }

  type ResponseAuth{
    response: Response
    user: User
  }
  type ResponseTask{
    response: Response
    task: Task
  }
  type ResponseTasksUser{
    response: Response
    tasks: [Task]
  }

  input LoginInput{
    username: String!
    password: String!
  }
  input RegisterInput{
    username: String!
    password: String!
    name: String!
  }
  input UpdateUserInput{
    id: ID!
    username: String!
    name: String!
  }
  input TaskInput{
    title: String!
    description: String!
    userID: ID!
  }


  type Query {
    users: [User]
    tasksByUser(userID: ID!): ResponseTasksUser
  }
  
  type Mutation {
    login(input: LoginInput!): ResponseAuth
    register(input: RegisterInput!): ResponseAuth
    updateUser( input: UpdateUserInput): ResponseAuth
    newTask(task: TaskInput!): ResponseTask
    updateTaskStatus(id: ID!, status: Int!): ResponseTask
  }
`);

module.exports = schema;
