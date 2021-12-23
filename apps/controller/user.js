const { Router } = require('express');
const authMiddleware = require('../middleWares/authentication');
const UserModel = require('../models/User');

const router = new Router();
const AVAILABLE_UPDATE = ['name', 'age', 'password', 'address', 'email'];

const signupUser = async (req, res) => {
	try {
		const newUser = await new UserModel(req.body);
		if (!newUser.password) {
			return res.status(400).send('Need password to sign up a new user');
		}
		const token = await newUser.generateAuth();
		await newUser.save();
		res.status(201).send({ newUser, token });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.post('/users/signup', signupUser);

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await UserModel.findByCredential(email, password);
		const token = await user.generateAuth();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send(error.message);
	}
};

router.post('/users/login', loginUser);

const logOutUser = async (req, res) => {
	try {
		const user = req.user;
		user.tokens.filter((token) => token !== req.token);
		await user.save();
		res.send();
	} catch (error) {
		res.status(400).send(error.message);
	}
};

router.post('/users/logout', authMiddleware, logOutUser);

const logOutAllUser = async (req, res) => {
	try {
		const user = req.user;
		user.tokens = [];
		await user.save();
		res.send();
	} catch (error) {
		res.status(400).send(error.message);
	}
};

router.post('/users/logout-all', authMiddleware, logOutAllUser);

const updateUser = async (req, res) => {
	try {
		const updateField = Object.keys(req.body);
		const user = req.user;
		const infoUpdate = req.body;

		const isValidUpdate = updateField.every((update) =>
			AVAILABLE_UPDATE.includes(update),
		);

		if (!isValidUpdate) {
			return res.status(400).send({ error: 'Invalid update field' });
		}
		updateField.forEach((field) => (user[field] = infoUpdate[field]));
		await user.save();
		res.send(user);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.put('/users/me', authMiddleware, updateUser);

const deleteUser = async (req, res) => {
	try {
		const user = req.user;
		await user.remove();
		res.send();
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.delete('/users/me', authMiddleware, deleteUser);

const getUserProfile = async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.get('/users/me', authMiddleware, getUserProfile);

module.exports = router;
