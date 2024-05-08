import express from 'express'
import cors from 'cors'

import problemRouter from './routes/problemRoutes.js'
import { connectDb } from './config/dbConnection.js'
const app=express()

connectDb()
app.use(cors())
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/problems',problemRouter)

app.listen(5000,()=>{
    console.log('server listening on 5000')
})



