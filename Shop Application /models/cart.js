const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {


    static deleteProduct(id , productPrice) {
        fs.readFile(p , (err, fileContent) => {
            if(err){
                return;
            }
            const updatedCart = JSON.parse(fileContent.toString());

            const productIndex = updatedCart.products.findIndex(product => product.id === id);
            if(productIndex < 0){
                return;
            }
            const productQty = updatedCart.products[productIndex].qty;

            updatedCart.products = updatedCart.products.filter(
                product => product.id !== id
            );
            updatedCart.totalPrice -= productQty * productPrice;

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                if (err) console.error("Error writing cart.json:", err);
            });

        })
    }
    static addProduct(id, productPrice , cb) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };

            // Handle missing file or empty content
            if (!err) {
                const text = fileContent.toString().trim();
                if (text) {
                    try {
                        const parsed = JSON.parse(text);
                        cart = {
                            products: parsed.products || [],
                            totalPrice: parsed.totalPrice || 0
                        };
                    } catch (parseErr) {
                        console.log("Invalid JSON in cart.json — resetting cart.");
                    }

                }
            }

            // Update cart
            const existingProductIndex = cart.products.findIndex(prod => prod.id.toString() === id.toString());
            const existingProduct = cart.products[existingProductIndex];

            if (existingProduct) {
                existingProduct.qty++;
                cart.products[existingProductIndex] = existingProduct;
            } else {
                cart.products.push({ id : id.toString(), qty: 1 });
            }

            cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(productPrice);

            // Save cart
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (cb) cb(err)
            });
        });
    }

    static getCart(cb){
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent.toString());
            if(err)
            {
                cb(null)
            }
            else
            {
                cb(cart)
            }
        })
    }
};
