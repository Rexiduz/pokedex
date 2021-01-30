export default (() => ({
  cards: require('./cardApis').default,
  users: require('./userApis').default
}))()
