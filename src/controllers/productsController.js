const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const finalPrice = (price,  discount) => Math.round(price - (price * (discount/100)))

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products',{
		products,
		toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		//asi no me anda el detalle de un producto en home 
		//pero si me lleva al detalle de un producto cuando lo creo (lo cre con id)
		//const {id} = parseInt(req.params) 
		//const productDetail = products.find(e => e.id === id)
		
		// asi me anda pero no me lleva al detalle de un producto cuando lo creo 
		const {id} = req.params 
		const productDetail = products.find(e => e.id === +id)
		res.render('detail', {productDetail, toThousand, finalPrice})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {	
		let product = req.body		
		product.id = products.length+1
		product.image = req.file ? req.file.filename : 'default-image.png'		
		products.push(product)
		
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))

		res.redirect(`/products/detail/${product.id}`)
	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = products.find(e => e.id === +req.params.id)
		res.render('product-edit-form', {product})
	},
	// Update - Method to update
	update: (req, res) => {
		const productUpdate = products.find(product => product.id === +req.params.id)
		const {name, price, discount, category, description} = req.body
		if(productUpdate) {
			productUpdate.name = name;
			productUpdate.price = +price;
			productUpdate.discount = +discount;
			productUpdate.category = category;
			productUpdate.description = description;

			fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

			res.redirect(`/products/detail/${req.params.id}`);
		}
		else {
			res.redirect('/')
		}
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products = products.filter(product => product.id !== +req.params.id);

		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

		res.redirect('/')
	}
};

module.exports = controller;