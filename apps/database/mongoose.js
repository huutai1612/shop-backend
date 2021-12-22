const mongoose = require('mongoose');

const connectDb = async () => {
	await mongoose.connect(process.env.MONGO_URL);
};

const disconnectDb = async () => {
	mongoose.disconnect();
};

module.exports = { connectDb, disconnectDb };
