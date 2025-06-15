import express from 'express';
import cors from 'cors';
const PORT = 3000;
import { fetchPublisherData } from './puppeteer.js';

const app = express();

app.use(express.json());
app.use(cors({origin: "*"}));

app.get('/', (req, res) => {
    console.log("Hello World");
    res.status(200).send("Hello World");
})

app.post('/search', async (req, res) => {
  const { publisher } = req.body;
  console.log("🔍 Received publisher:", publisher);

  if (!publisher) {
    return res.status(400).send({ message: "Publisher name is required" });
  }

  try {
    const response = await fetchPublisherData(publisher);
    console.log("✅ Scraped response:", response);

    res.status(200).send({ response });
  } catch (error) {
    console.error("❌ Error in fetchPublisherData:", error);
    res.status(500).send({ message: "Error finding data", error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`);
})
