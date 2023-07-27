const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routers/authRouter')
const controller = require('./controllers/authController')
const PORT = process.env.PORT || 5000


const app = express()

app.use(express.json())
app.use('/auth', authRouter)


const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://mrsuperko:jvpENv1VAbDzZagN@icity.mif0aqd.mongodb.net/')
        app.listen(PORT, () => console.log('server started on port ${PORT} success'))
    } catch (error) {
        console.log(error)
    }
}

start()