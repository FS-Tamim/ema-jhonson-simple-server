const express=require('express');
const bodyParser=require('body-parser');
const cors=require("cors");
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o2jpm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app=express();
app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

client.connect(err => {
  const productcollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLL);
  const ordercollection = client.db(process.env.DB_NAME).collection("order");
  
  app.post('/addProducts',(req,res)=>{
      const product=req.body;
      console.log(product);
      productcollection.insertOne(product)
      .then(result=>{
       res.send(result)
     })
  })

  app.get('/products',(req,res)=>{
      productcollection.find({})
      .toArray((err,document)=>{
          res.send(document);
      })
  })

  app.get('/product/:key',(req,res)=>{
    productcollection.find({key: req.params.key})
    .toArray((err,document)=>{
        res.send(document[0]);
    })
})

app.post('/productByKeys',(req,res)=>{
    const productKey=req.body;
    productcollection.find({key:{$in: productKey}})
    .toArray((err,document)=>{
        res.send(document);
    })
})

app.post('/addOrder',(req,res)=>{
    const order=req.body;
    
    ordercollection .insertOne(order)
    .then(result=>{
     res.send(result.insertedCount>0        )
   })
})
});

app.listen(process.env.PORT||5000);