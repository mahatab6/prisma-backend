import express from "express"
import { postRouter } from "./modules/post/post.router"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors({
  origin: process.env.APP_Origins,
  credentials: true
}))

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use('/post', postRouter)


app.get('/', (req, res) => {
  res.send('Prisma Server was running!')
})


export default app;