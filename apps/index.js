const express = require('express');
require('dotenv').config({ path: './apps/config/dev.env' });

const { connectDb } = require('./database/database');
const app = express();

const PORT = process.env.PORT;
connectDb().catch((err) => console.log(err.message));

app.use(express.json());

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
