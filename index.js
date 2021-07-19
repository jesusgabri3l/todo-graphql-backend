const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./graph/schema');
const root = require('./graph/root');
 
const app = express();


app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
    console.log('Running a GraphQL API server at http://localhost:4000/graphql');
})                                               