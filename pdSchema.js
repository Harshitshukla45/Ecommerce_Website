const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: String,
    title: String,
    price: Object,
    rating: Object,
    image: String

});
const Products = new mongoose.model("products", productSchema);
module.exports = Products;