import express  from "express";
import 'dotenv/config'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'NOVA API is running',
  })
})

app.listen(PORT, () => {
  console.log(`NOVA API running on port ${PORT}`)
})