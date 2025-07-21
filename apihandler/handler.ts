import { nanoid } from "nanoid";
import pool from "../db";
import { Request, Response } from "express";

//to create table if it doesn't exist
async function createTableIfNotExist() {
  const tableCheck = await pool.query(
    `select exists (select from information_schema.tables where table_schema='public' and table_name='urlshortner')`
  );
  if (!tableCheck.rows[0].exists) {
    await pool.query(`CREATE TABLE UrlShortner ( id SERIAL PRIMARY KEY,
            base_url TEXT NOT NULL,
            shorten_id VARCHAR(10) UNIQUE NOT NULL,
            visit_count INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  }
}

//to shorten the URL
export async function shortenURL(request: Request, response: Response) {
  let body = request.body;
  await createTableIfNotExist();
  const res = await pool.query(
    `insert into UrlShortner (base_url, shorten_id,visit_count) Values ($1,$2,$3) RETURNING *;`,
    [body.url, nanoid(body.slugLength), 0]
  );
  if (res.rowCount == 1) {
    response.json(res.rows);
  } else {
    response.json(res);
  }
}

//to redirect the URL
export async function redirectURL(request: Request, response: Response) {
  const id: string = request.params.id;

  const res = await pool.query(
    "select base_url from UrlShortner where shorten_id= $1;",
    [id]
  );
  await pool.query(
    `Update UrlShortner set visit_count=visit_count+1 where shorten_id=$1;`,
    [id]
  );

  if (res.rowCount == 1) {
    response.redirect(res.rows[0].base_url);
  } else {
    response.status(404).send(`<b>URL IS NOT FOUND</b>`);
  }
}

//to list all entries from db
export async function listURLs(request: Request, response: Response) {
  await createTableIfNotExist();
  const list = await pool.query("select * from UrlShortner;");

  if (list.rowCount > 0) {
    response.json(list.rows);
  } else {
    response.json([]);
  }
}

//to edit the slug
export async function editSlug(request: Request, response: Response) {
  const editSlugID = await pool.query(
    "Update UrlShortner SET shorten_id=$1, visit_count=0 where shorten_id=$2;",
    [request.body.newSlug, request.body.slug]
  );
  response.json(editSlugID);
}
