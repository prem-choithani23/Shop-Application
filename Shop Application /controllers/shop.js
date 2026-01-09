const {Product, Cart, Order} = require("../models/index");
const {or} = require("sequelize");



exports.getProducts = (req, res, next) => {

    Product.findAll({raw:true})
        .then((products) =>{


            res.render('shop/product-list',{
                products:products ,
                pageTitle : 'Shop' ,
                activeProducts : true,
                productCSS : true,
                hasProducts: products.length > 0,
                path : "/" // FOR PUG
            })
        })
        .catch(err => console.log(err))


}

exports.getProduct  =  (req, res, next) => {
    const productId = req.params.productId;

    console.log("REQ PARAMS : ", req.params);
    console.log("Details iska kholna hai : ", productId)

    Product.findByPk(productId , )
        .then( product=>{

            res.render('shop/product-details',{
                product : product.toJSON(),
                pageTitle : product.title ,
                activeProducts : true,
            });
        })
        .catch((err) => console.log(err) );

}

exports.postCarts = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQty = 1;

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId }  } );
        })
        .then(products => {
            let product;

            if (products.length > 0) {
                product = products[0];
                const oldQty = product.cartItem.quantity;
                newQty = oldQty + 1;
                return product;
            }


            return Product.findByPk(prodId)

        })
        .then(product =>{
            return fetchedCart.addProduct(product , {through : {quantity: newQty}})
        })
        .then((cart) => {
            res.redirect('/cart'); // ✅ inside chain
        })
        .catch(err => console.log(err));
};


exports.getIndex = (req, res, next) => {

    Product.findAll({raw:true})
        .then(products =>{
            // console.log("PRODUCTS : ",products);
            res.render('shop/index',{
                pageTitle : 'Shop' ,
                products : products,
                activeIndex : true,
                productCSS : true,
                hasProducts: products.length > 0,
            })
        })
        .catch(err => console.log(err))

}

exports.getCart = (req,res,next)=>{


    req.user.getCart()
        .then((cart)=>{
            return cart.getProducts()
        })
        .then(products =>{

            const plainProducts = products.map(p => {
                const prod = p.get({ plain: true });
                prod.cartItem = p.cartItem ? p.cartItem.get({ plain: true }) : null;
                return prod;
            });

            res.render('shop/cart' , {
                activeCart : true,
                pageTitle : 'My Cart',
                cartCSS : true,
                hasProducts: plainProducts.length > 0,
                products : plainProducts})
        })

}


exports.getOrders = (req,res,next)=>{
    res.render('shop/orders' , {activeOrders : true,pageTitle : 'My Orders',})
}

exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{activeCheckout : true,pageTitle : 'My Checkout ',})
}

exports.postCartDeleteProduct = (req,res,next)=>{
    const productId = req.body.productId
    console.log("PRODUCT TO DELETE : " , productId)

    req.user.getCart()
        .then(cart =>{
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products =>{
            console.log("product to delete 1 : " , products)
            const product = products[0]
            return product.cartItem.destroy()
        })
        .then(result =>{
            res.redirect('/cart')
        })
        .catch(err => console.log(err))


}


// ORDERS

exports.postOrder = async (req, res, next) => {
    try {
        const cart = await req.user.getCart();
        const products = await cart.getProducts();

        if (!products || products.length === 0) throw new Error('Cart is empty!');

        // Prepare products with quantities
        const productsData = products.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            quantity: p.cartItem.quantity
        }));

        // Create the order and store productsData
        const order = await req.user.createOrder({ productsData });

        // Optional: still create associations (without quantity)
        await order.addProducts(products);

        // Clear cart
        await cart.setProducts(null);

        res.redirect('/orders');
    } catch (err) {
        console.log('POST ORDER ERROR:', err);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders({
            include: [Product] // optional, for product details
        });

        const plainOrders = orders.map(order => {
            const plainOrder = order.get({ plain: true });

            // Map quantity from productsData
            if (plainOrder.productsData && plainOrder.productsData.length) {
                plainOrder.products = plainOrder.products.map(p => {
                    const prodData = plainOrder.productsData.find(pd => pd.id === p.id);
                    p.displayQuantity = prodData ? prodData.quantity : 1;
                    return p;
                });
            } else {
                // fallback
                plainOrder.products.forEach(p => (p.displayQuantity = 1));
            }

            return plainOrder;
        });

        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: plainOrders,
            hasOrders: plainOrders.length > 0
        });
    } catch (err) {
        console.log('GET ORDERS ERROR:', err);
    }
};
