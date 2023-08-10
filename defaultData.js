const Products = require("./pdSchema");
const pdata = require('./pd');
const DefaultData = async () => {
    try {
        await Products.deleteMany({});
        const storeData = await Products.insertMany(pdata);
        //console.log(storeData.length);

    } catch (error) {
        console.log(error.message);
    }
};
module.exports = DefaultData;