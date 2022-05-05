const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.13wub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();

        const productCollection = client.db('shared-soft').collection('product')

        // -----------------------------------------
        // ---------------GET method
        // -----------------------------------------
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find(req.query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // get one product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query)
            res.send(product)
        })

        // get USER's product
        app.get('/userProduct/:email', async (req, res) => {
            const email = req.params.email
            const cursor = productCollection.find({ email: email });
            const result = await cursor.toArray()
            res.send(result)
        })


        // -----------------------------------------
        // ---------------POST method
        // -----------------------------------------
        app.post('/product', async (req, res) => {
            const product = req.body; // get the doc
            const result = await productCollection.insertOne(product);
            // console.log(product);
            res.send(result)
        })


        //PUT methods
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    ...updatedProduct
                },
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // DELETE method
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

    } finally {

    }
}
run().catch(console.dir);

console.log('sun glass');

// GET method here

app.get('/', (req, res) => {
    res.send('Hello express!')
})

app.get('/hero', (req, res) => {
    res.send('hero kuku')
})

app.get('/heroku', (req, res) => {
    res.send('i am heroku')
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
