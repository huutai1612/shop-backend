const { Router } = require('express');
const ProductModel = require('../models/Product');

const router = new Router();

const getSortType = (sort, typeOfSort) => {
	const type = typeOfSort.split('_');
	if (type[1] === 'asc') {
		sort[type[0]] = 1;
	} else {
		sort[type[0]] = -1;
	}
};

// get all products
router.get('/products', async (req, res) => {
	try {
		const skip = parseInt(req.query.skip) || 0;

		const sort = {};

		const typeOfSort = req.query.sort;

		typeOfSort && getSortType(sort, typeOfSort);

		const allProducts = await ProductModel.find({}, null, {
			limit: 9,
			skip,
			sort,
		});
		res.send(allProducts);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

// create new products
router.post('/products', async (req, res) => {
	try {
		const newProduct = new ProductModel(req.body);
		await newProduct.save();
		res.status(201).send(newProduct);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

module.exports = router;
