import fastify from "fastify"
const path = require("path")
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import {loadToDB, getSreality} from "./scraping"

const app = fastify({logger:true})

app.register(require('@fastify/static'), {
    root: path.join(__dirname, 'build')
  })

/*Define interface for query parameter page*/
interface Iquerystring {page:string}

/*============================Endpoint for fetching the data from DB============================*/

app.get<{Querystring:Iquerystring}>("/data",(req,rep)=>{

    /*function which check, if the DB is empty - if so, scraping will start (call fn. getSreality)
    and DB will be fed by data. If not, nothing will happend*/

    const checkDB = async () =>{

        const countItems = await prisma.properties.count({})
        
        if(countItems != 0){
            
        }   else {
            await getSreality()
        }}

    /*extract parameter page from query*/
    const page:number = +req.query.page

    /*function which run the fn. checkDB and then select desired data from DB*/

    const getData = async (page:number) => {

        await checkDB()

        /*Array of indexes which will select desired rows from DB*/

        var baseIDs:number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

        /*Formula with parameter page (represents current page in pagination), which change the values of numbers
        in baseIDs such that the correct rows are selected for each page in pagination*/

        const selectIDs:number[] = baseIDs.map(function(x){return x+20*(page-1)})

        /*select data from DB */
        
        const props = await prisma.properties.findMany(
            {where:{index:{in:selectIDs}},
            select:{
                Title: true,
                ImageURL:true
            }}
        )
        /*send data */
        rep.send(props)
        }
        /**call function getData */
    getData(page) 
})

/*============================Endpoint for refreshing data in DB============================*/

app.get("/refresh",(req,rep)=>{

    /*function which check, if the DB is empty - if so, scraping will start (call fn. getSreality)
    and DB will be fed by data. If not, firstly DB will be deleted and the fed by new data*/

    const check_n_delete = async () =>{

        const countItems = await prisma.properties.count({})
        
        if(countItems != 0){

            var arr:number[] = []

            /*Create array of indexes of ows which will be deleted (all items) */

            for(let i=1;i<501;i++){
            arr.push(i)}

            const proms = await prisma.properties.deleteMany(
                {where:{index:{in:arr}},
                }
            )
                /*start scraping and fed DB by data after original data are deleted */
            await getSreality()

        }   else {
            /*or just start scraping and fed the DB*/
            await getSreality()
        }
            rep.send("refreshed")
}

/*call defined fn.  */
check_n_delete()

})

/*send index.html (frontend part) file as a response when browser sends get request on port 3000 without any parameters*/
app.get("/",(req,rep)=>{

        const fs = require('fs')
        const stream = fs.createReadStream("./build/index.html")
        rep.type('text/html').send(stream)   
    }
)

app.listen({port:3000},(err,adress)=>{
    if(err){
        app.log.error(err)
    }else {
        app.log.info("Server listening on " + adress)
    }
})
