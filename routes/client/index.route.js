const homeRouter = require("./home.route")
const productRouter = require("./product.route")

module.exports = (app) => { 
    app.use("/",homeRouter);
    app.use("/products",productRouter);
   
}