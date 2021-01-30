const ENV = process.env.NODE_ENV || 'development'

const VARIABLES = {
  production: { BASE_URL: process.env.REACT_APP_BASE_URL },
  development: { BASE_URL: 'http://localhost:3030/api/v1/' }
}

export default VARIABLES[ENV]
