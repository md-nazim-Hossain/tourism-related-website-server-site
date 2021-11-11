const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// db details
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbvyd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
   try{
        await client.connect();
        
        const database = client.db("TourismDb");
        const tourismCollection = database.collection("tourism");
        const myBookingCollection = database.collection("myBooking");

        //GET API 
        app.get('/services', async (req ,res) =>{
            const getServices = tourismCollection.find({});
            const services = await getServices.toArray();
            res.json(services);
        });

        // GET API WITH ID
        app.get('/services/:id', async(req ,res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await tourismCollection.findOne(query);
            res.json(result);
        });

        //GET ALL MY BOOKING API
        app.get('/myBookings/:email', async (req, res) =>{
            const email = req.params.email;
            const query = {email:email}
            const myBooking = myBookingCollection.find(query);
            const result = await myBooking.toArray();
            res.json(result);
        });

        //GET API 
        app.get('/manageBookings', async (req ,res) =>{
            const manageBookings = myBookingCollection.find({});
            const result = await manageBookings.toArray();
            res.json(result);
        });

        //POST BOOKING DATA API
        app.post('/booking' , async (req,res) =>{
            const myBooking = req.body;
            const result = await myBookingCollection.insertOne(myBooking);
            res.json(result);
        });

        //POST SINGLE DATA API
        app.post('/addService', async (req ,res) =>{
            const service = req.body;
            const result = await tourismCollection.insertOne(service);
            res.json(result);
        });

        //UPDATED API
        app.put("/myBooking/:id", async(req, res)=>{
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = {_id:ObjectId(id)};
            const updateDoc = {
                $set: {
                  status: updateStatus.status
                },
              };
            const result = await myBookingCollection.updateOne(filter,updateDoc);
            res.json(result);
        });

        // DELETE MY BOOKING API
        app.delete('/myBooking/:id', async (req , res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await myBookingCollection.deleteOne(query);
            res.json(result);
        })
        
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);
app.get('/', (req, res) =>{
    res.send("Server Running");
});

app.listen(port, () =>{
    console.log("Running Server Port",port);
})