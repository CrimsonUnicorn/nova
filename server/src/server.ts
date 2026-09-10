import express  from "express";
import 'dotenv/config'
import cors from 'cors'
import { connectDatabase } from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import commentRoutes from './routes/commentRoutes'


const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
app.use(express.json())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api', commentRoutes)

app.get("/", (req, res) => {
  res.send("NOVA API is working!");
});

connectDatabase().then(() => {
  app.listen(Number(process.env.PORT), '0.0.0.0', () => {
    console.log(`NOVA API running on port ${PORT}`)
  })
})

