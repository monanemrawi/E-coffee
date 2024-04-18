const port = process.env.PORT;
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../models/product');

// Destination path for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../upload/imgs'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serve uploaded images statically
router.use('/imgs', express.static(path.join(__dirname, '../upload/imgs')));

router.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/imgs/${req.file.filename}`
    });
});

// Adding a product
router.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if(products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else {
        id = 1;
    }
    const product = new Product({
        id,
        ...req.body
    });
    console.log(product);
    try {
        await product.save();
        console.log('Saved');
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ success: false, error: 'Error saving product' });
    }
});

// deleting a product 
router.delete('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({id:req.body.id});
    console.log('Removed');
    res.json({
        success: true,
        name: req.body.name
    })
})

// get all products 
router.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("all products fetched")
    res.send(products)
})

module.exports = router;
