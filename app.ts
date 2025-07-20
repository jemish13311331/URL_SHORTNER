import express, {Request,Response} from 'express';
import { nanoid } from 'nanoid';
import {Pool} from 'pg';
import cors from 'cors';



const PORT = 4000;

interface myInterface{
    [key:string]:string
}

const pool:any = new Pool({
    user: 'jemish',
    host: 'dpg-d1tt25je5dus73dvl5n0-a',
    database: 'mydb_qlq2',
    password: 'L91yAWUt8AU8pojHhGUQekuzPGZt4W39',
    port: 5432, // default
  });

const app=express();
app.use(cors())

app.use(express.json())

app.post('/url-shortner',async(request:Request, response:Response)=>{
    let a=request.body
    // database[a.url]=`https://${domain}/${nanoid(7)}`
    console.log(a)
    const res=await pool.query(`insert into UrlShortner (base_url, shorten_id) Values ($1,$2) RETURNING *;`,[a.url,nanoid(7)])
    if (res.rowCount==1){
        response.json(res.rows)
    }
    else{
        response.json(res)
    }
})

app.get('/au/:id',async(request:Request, response:Response)=>{
    let a=request.params.id
    // database[a.url]=`https://${domain}/${nanoid(7)}`
    console.log(a)
   
    const res=await pool.query('select base_url from UrlShortner where shorten_id= $1;',[a])
    
    if(res.rowCount==1){
        response.redirect(res.rows[0].base_url);
    } 
})

app.listen( process.env.PORT,()=>console.log("project is running on the port number",PORT))