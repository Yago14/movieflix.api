import  express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/movies", async (_,res)=>{
    const movies = await prisma.movies.findMany({
        orderBy:{
            title:"asc",
        },
        include :{
            genres: true, 
            languages: true
        }
    });
    res.json(movies);

})


app.post("/movies", async (req,res)=>{

  const { title, genre_id, language_id, oscar_count, release_date} = req.body;
    
try{

    const movieWithSameTitle = await prisma.movies.findFirst
    ({
        where:{title:{equals: title, mode:"insensitive"}}
    })
    if(movieWithSameTitle){
        return res.status(409).send({
            message:'Já existe um filme cadastro com esse titulo'
        })
    }

    await prisma.movies.create({
        data:{
            title,
            genre_id,
            language_id,
            oscar_count,
            release_date: new Date(release_date)
        }
    })
    res.status(201).send();

}catch(error){
    res.status(500).send({message: "Falha ao cadastrar um filme"})
}

})



app.listen(port,()=>{
    console.log(`servidor rodando na pota ${port}`)
})


