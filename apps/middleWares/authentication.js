const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const authMiddleware = async (req, res, next) => {
	if (!req.headers.authorization)
		return res.status(400).send({ error: 'Need authorization' });
	const token = req.headers.authorization.replace('Bearer ', '');
	const { _id } = jwt.decode(token);
	const user = await UserModel.findOne({ _id });

	if (!user) return res.status(404).send({ error: `Don't exist user ` });

	req.user = user;
	req.token = token;
	next();
};

module.exports = authMiddleware;
