import express from 'express';
import cors from 'cors';
const PORT = 3000;
import { fetchPublisherData } from './puppeteer.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
}))

app.get('/', (req, res) => {
    console.log("Hello World");
    res.status(200).send("Hello World");
})

app.post('/search', async (req,res) => {
    const {publisher} = req.body;

    if(!publisher) {
        res.status(401).send({message: "Publisher name not found"});
    }

    try {
        const response = await fetchPublisherData(publisher);
        res.status(200).send({response});
    } catch (error) {
        console.log(error);
        res.status(401).send({message: "Error finding data"});
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`);
})