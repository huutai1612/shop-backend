const express = require('express');
require('dotenv').config({ path: './apps/config/dev.env' });
const productRouter = require('./controller/product');

const { connectDb } = require('./database/mongoose');
const app = express();

const PORT = process.env.PORT;
connectDb().catch((err) => console.log(err.message));

app.use(express.json());
app.use(productRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
