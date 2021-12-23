const { Router } = require('express');
const UserModel = require('../models/User');

const router = new Router();

const signupUser = async (req, res) => {
	try {
		const newUser = await new UserModel(req.body);
		if (!newUser.password) {
			return res.status(400).send('Need password to sign up a new user');
		}
		await newUser.save();
		res.status(201).send(newUser);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.post('/users/signup', signupUser);

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findByCredential(email, password);
		const token = await user.generateAuth();

		res.send(user, token);
	} catch (error) {
		res.status(400).send(error.message);
	}
};

router.post('/users/login', loginUser);

module.exports = router;
