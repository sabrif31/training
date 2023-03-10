import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import App from './App'

const client = new ApolloClient({
  uri: 'http://localhost:4242/graphql/',
  cache: new InMemoryCache(),
  /*
  headers: {
    authorization: `Bearer ${process.env.API_KEY}`,
  },
  */
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)
