console.log(process.env.GQL_ENDPOINT)
export const config = {
  graphqlEndpoint: process.env.GQL_ENDPOINT || 'http://localhost:3000/graphql'
}