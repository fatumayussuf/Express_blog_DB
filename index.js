import express from 'express';
import {MongoClient} from "mongodb"
// import 'dotenv/config'

let app = express();
let port = 3000 

//Set templating engine
app.set("views","./views");
app.set("view engine","pug");

//Set static assets
app.use(express.static("public"));

//Body parser
app.use(express.urlencoded({extended:true}));


let uri=`mongodb+srv://fatumayussuf:${process.env.MONGODB_PASSWORD}@cluster0.r1xw2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
let client = new MongoClient(uri)

// Home route
app.get("/",async (req, res) => {
    //fetch blogs from db
 let db = client.db("blog");
    let collection = db.collection("blog");

    let blogs =  await collection.find().toArray();
    console.log({blogs});
    res.render("index", { title: "blogs" , blogs});
  });
  
  // New blog route
  app.get("/new_post", (req, res) => {
    res.render("new_post", { title: "New post" });
  });
  
  app.post("/new_post", async (req, res) => {
    let body = req.body;
  
    // Validation
    if (
      !body.title ||
      !body.content ||
      !body.image ||
      !body["author-name"] ||
      !body["author-image"]
    ) {
      return res.status(400).render("error", {
        message: "Invalid input data. Check your form and submit again",
      });
    }
  
    let blogObj = {
      title: body.title,
      content: body.content,
      image: body.image,
      author_name: body["author-name"],
      author_image: body["author-image"],
    };
  
   // Create a post document in the db
    let db = client.db("blog");
    let collection = db.collection("blog");
  
    let result = await collection.insertOne(blogObj);
    console.log({ result });
  
    res.redirect("/");
  });
  
  app.listen(port, () => console.log(`Server running at port ${port}`));