const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const mongoose = require('mongoose')
const routes = require('./routes')
mongoose
  .connect(
    'mongodb+srv://nitish:5o6TOpGyknXuGs58@cluster.iomcn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch(err => {
    console.log(err)
  })

app.use(routes)

app.listen(3000, () => console.log('Server started on port 3000'))
