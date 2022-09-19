const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config()
require('express-async-errors')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

// middleware
const notFoundMiddleWare = require('./middleware/not-found')
const errorHandlerMiddleWare = require('./middleware/error-handler')

// routes
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/v1/products', productsRouter)

// error handler
app.use(notFoundMiddleWare)
app.use(errorHandlerMiddleWare)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => console.log(`http://localhost:${port}/`))
  } catch (error) {}
}
start()
