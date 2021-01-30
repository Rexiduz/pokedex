const app = require('express')()
const cors = require('cors')

const PORT = 3030

app.use(cors())
app.use(require('./middleware/responseInterceptor'))
app.use(require('./middleware/applyErrorGenerator'))
app.use(require('./middleware/authenticate'))
app.use(require('./middleware/applyDb'))
app.use('/api/v1', require('./router'))

app.listen(PORT, () => console.log(`app start @ port ${PORT}\n\n`))
