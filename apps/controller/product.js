const { Router } = require('express');
const ProductModel = require('../models/Product');

const router = new Router();
const NUMBER_OF_SKIP = 9;
const AVAILABLE_UPDATE = ['name', 'price', 'description', 'image', 'gender'];

const splitSortType = (originalObject, typeOfSort) => {
	const type = typeOfSort.split('_');
	if (type[1] === 'asc') {
		originalObject[type[0]] = 1;
	} else {
		originalObject[type[0]] = -1;
	}
};

const splitFilterType = (originalObject, typeOfFilter) => {
	const type = typeOfFilter.split('_');
	originalObject[type[0]] = type[1].toLowerCase();
};

const getAllProducts = async (req, res) => {
	try {
		const skip = parseInt(req.query.skip) * NUMBER_OF_SKIP || 0;

		const sort = {};

		const filter = {};

		req.query.sort && splitSortType(sort, req.query.sort);

		req.query.filter && splitFilterType(filter, req.query.filter);

		const allProducts = await ProductModel.find(filter, null, {
			limit: 9,
			skip,
			sort,
		});
		res.send(allProducts);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.get('/products', getAllProducts);

const getProductById = async (req, res) => {
	try {
		const _id = req.params.id;
		const foundedProduct = await ProductModel.findById(_id);
		res.send(foundedProduct);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.get('/products/:id', getProductById);

const createNewProduct = async (req, res) => {
	try {
		const newProduct = new ProductModel(req.body);
		await newProduct.save();
		res.status(201).send(newProduct);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.post('/products', createNewProduct);

const updateProduct = async (req, res) => {
	try {
		const updateFields = Object.keys(req.body);
		const _id = req.params.id;
		const foundedProduct = await ProductModel.findById(_id);
		const isValidUpdate = updateFields.every((update) =>
			AVAILABLE_UPDATE.includes(update),
		);

		if (!isValidUpdate)
			return res.status(400).send({ error: 'Need Valid field to update' });

		updateFields.forEach((field) => (foundedProduct[field] = req.body[field]));
		await foundedProduct.save();
		res.send(foundedProduct);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.put('/products/:id', updateProduct);

const deleteProductById = async (req, res) => {
	try {
		const _id = req.params.id;
		await ProductModel.findByIdAndDelete(_id);
		res.send();
	} catch (error) {
		res.status(500).send(error.message);
	}
};

router.delete('/products/:id', deleteProductById);

module.exports = router;
