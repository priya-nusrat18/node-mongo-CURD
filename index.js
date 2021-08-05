const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;
const app = express()
 app.use(cors())

const port = 3000


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://PracticeSimpleProject:PracticeSimpleProject123@cluster0.1msfu.mongodb.net/practiceProject?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})



client.connect(err => {
  const productCollection = client.db("practiceProject").collection("products");
//----c---//
app.post("/addProduct", (req, res) => {
  const product = req.body;
  console.log(product);
  productCollection.insertOne(product)
  .then(result => {
    res.redirect('/')
  })
})
//----r----//
 app.get('/products' , (req, res) => {
  productCollection.find({})
  .toArray((err , documents) =>{
    res.send(documents);
  })
 })
 //-----u----//
 //---get information of single product by id----//
 app.get('/product/:id', (req, res) => {
  productCollection.find({_id: ObjectId(req.params.id)})
  .toArray ( (err, documents) =>{
    res.send(documents[0]);
  })
})
//-----update information-----////
app.patch('/update/:id', (req, res) => {
  productCollection.updateOne({_id: ObjectId(req.params.id)},
  {
    $set: {price: req.body.price, quantity: req.body.quantity}
  })
  .then (result => {
    res.send(result.modifiedCount > 0)
  })
})
 //-----d-----//

app.delete('/delete/:id', (req, res) =>{
  productCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then( result => {
    res.send(result.deletedCount > 0);
  })
})

 console.log('connected');
});


app.listen(port)