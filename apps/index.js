const express = require('express');
const fs = require('fs');
require('dotenv').config({ path: './apps/config/dev.env' });
const productRouter = require('./controller/product');
const userRouter = require('./controller/user');

const { connectDb } = require('./database/mongoose');
const User = require('./models/User');
const app = express();

const PORT = process.env.PORT;
connectDb().catch((err) => console.log(err.message));

const adminAccountFile = fs.readFileSync('admin-account.json');
const adminAccount = JSON.parse(adminAccountFile);

const main = async () => {
	const adminList = await User.find({ role: 'ADMIN' });
	if (adminList.length === 0) {
		adminAccount.forEach((admin) => {
			const newAdmin = new User(admin);
			newAdmin.save();
		});
	}
};

app.use(express.json());
app.use(productRouter);
app.use(userRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
main();
