import express, {Request,Response} from 'express';
import { nanoid } from 'nanoid';
import {Pool} from 'pg'

const PORT = 4000;

interface myInterface{
    [key:string]:string
}

const pool:any = new Pool({
    user: 'jemishitaliya',
    host: 'localhost',
    database: 'jemishitaliya',
    password: '12345678',
    port: 8080, // default
  });

const app=express();
const domain="xyz.com"
const database:myInterface={}

app.use(express.json())

app.post('/url-shortner',async(request:Request, response:Response)=>{
    let a=request.body
    // database[a.url]=`https://${domain}/${nanoid(7)}`
    console.log(a)
    const res=await pool.query(`insert into UrlShortner (base_url, shorten_id) Values ($1,$2) RETURNING *;`,[a.url,nanoid(7)])
    if (res.rowCount==1){
        response.json(res.rows)
    }
})

app.get('/au/:id',async(request, response)=>{
    let a=request.params.id
    // database[a.url]=`https://${domain}/${nanoid(7)}`
    console.log(a)
   
    const res=await pool.query('select base_url from UrlShortner where shorten_id= $1;',[a])
    
    if(res.rowCount==1){
        response.json(res.rows)
    } 
})

app.listen(PORT,()=>console.log("project is running on the port number",3000))