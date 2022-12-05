const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j9nln.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db('todo-hi');
        const datasCollection = database.collection('datas');


        // Get All The Datas API
        app.get('/datas', async (req, res) => {
            const cursor = datasCollection.find({});
            const datas = await cursor.toArray();
            res.send(datas);
        });

        // Add Datas API
        app.post('/datas', async (req, res) => {
            const data = req.body;
            const result = await datasCollection.insertOne(data);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('todo-hi-server is running')
})

app.listen(port, () => {
    console.log(`Listening at ${port}`)
})