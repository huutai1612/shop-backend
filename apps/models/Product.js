const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 6,
		},
		price: {
			type: Number,
			min: 10,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			required: true,
			minlength: 10,
			require: true,
		},
		image: {
			type: String,
			required: true,
			minlength: 6,
		},
	},
	{
		timestamps: true,
	},
);

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
