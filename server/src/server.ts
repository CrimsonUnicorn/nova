import express  from "express";
import 'dotenv/config'
import cors from 'cors'

import healthRoutes from './routes/healthRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors)
app.use(express.json())

app.use('/api/health', healthRoutes)

app.listen(PORT, () => {
  console.log(`NOVA API running on port ${PORT}`)
})