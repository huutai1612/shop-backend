const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const options = {
	timestamps: true,
};

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		age: {
			type: Number,
			default: 0,
			validate(value) {
				if (value < 0) {
					throw new Error('Age need a positive number');
				}
			},
		},
		role: {
			type: String,
			enum: ['ADMIN', 'USER'],
			default: 'USER',
			trim: true,
			uppercase: true,
		},
		address: {
			type: String,
			trim: true,
			default: '',
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			validate(value) {
				if (!validator.isEmail(value)) throw new Error('Invalid email');
			},
			required: true,
		},
		password: {
			type: String,
			require: [true, 'Need pass word to sign up a new user'],
			trim: true,
			minlength: 6,
			validate(password) {
				if (password.includes('password')) {
					throw new Error('The password can not be contain in your password');
				}
			},
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	options,
);

userSchema.statics.findByCredential = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) throw new Error('Invalid Email');

	const isValidPassword = await bcrypt.compare(password, user.password);

	if (!isValidPassword) throw new Error('Invalid Password');

	return user;
};

userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.tokens;
	delete user._v;
	delete user.createdAt;
	delete user.updatedAt;
	delete user.password;
	delete user.role;
	return user;
};

userSchema.methods.generateAuth = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 10);
	}

	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
