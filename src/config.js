const config = {}
config.API_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://api.caresactsmb.test'
    : 'https://api.caresactsmb.com'

export default config
