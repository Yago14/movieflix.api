import  express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.get("/movies", async (req,res)=>{
    const movies = await prisma.movies.findMany();
    res.json(movies);

})

app.listen(port,()=>{
    console.log(`servidor rodando na pota ${port}`)
})


