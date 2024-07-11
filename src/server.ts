import  express from "express";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json"


const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

    const movieWithSameTitle = await prisma.movies.findFirst({
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

app.put("/movies/:id", async (req, res)=>{
    
   
    const id = Number(req.params.id)
    const data = {...req.body};

    data.release_date = data.release_date ? new Date(data.release_date) : undefined;
    
     await prisma.movies.update({
        where:{
            id
        },
        data: data
        
    });
    
    res.status(200).send()
})

app.delete("/movies/:id", async (req,res)=>{
    const id = Number(req.params.id);

    const movie = await prisma.movies.findUnique({where: {id}})

    if(!movie){
        return res.status(404).send({
            message: "o filme não foi encontrado"
        })
    }

    await prisma.movies.delete({where:{id}});

    res.status(200).send();
  
})

app.get("/movies/:genreName", async(req,res)=>{
const moviesFilteredByGenreName = await prisma.movies.findMany({
    where:{
        genres:{
            name:{
                equals: req.params.genreName,
                mode: "insensitive"
            }
        }
    }
})

res.status(200).send(moviesFilteredByGenreName)

})





app.listen(port,()=>{
    console.log(`servidor rodando na pota ${port}`)
})


