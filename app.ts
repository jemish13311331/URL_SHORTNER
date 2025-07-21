import express, { Request, Response } from "express";
import cors from "cors";
import { rateLimitForApp } from "./apihandler/middleware";
import dotenv from "dotenv";
import {
  editSlug,
  listURLs,
  redirectURL,
  shortenURL,
} from "./apihandler/handler";
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

//to create shorten url
app.post("/url-shortner", async (request: Request, response: Response) =>
  shortenURL(request, response)
);

//to fetch existing url
app.get(
  "/au/:id",
  rateLimitForApp,
  async (request: Request, response: Response) => redirectURL(request, response)
);

//to fetch listof all shorten and base urls
app.get("/shorten-list", async (request: Request, response: Response) =>
  listURLs(request, response)
);

//to edit the slug of an existing shorten url
app.put("/edit-slug", async (request: Request, response: Response) =>
  editSlug(request, response)
);

//to run the app on specific port
app.listen(PORT, () =>
  console.log("project is running on the port number", PORT)
);
