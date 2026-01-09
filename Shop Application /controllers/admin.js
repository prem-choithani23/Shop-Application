const {Product} = require("../models/index");


exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product', {
        pageTitle: 'Add Products',
        activeAddProduct: true,
        formsCSS: true,
        productCSS : true,
        editing : false,
        path: '/admin/add-product' // FOR PUG
    })
}

exports.postAddProduct = (req,res,next)=>{

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;


    console.log("Req User :")
    console.log(req.user);

    // MAGIC METHOD FOR ASSOCIATIONS
    req.user.createProduct({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        // userId: req.user.id
    })
        .then((result) => {
            console.log("Product Created !!!");
            res.redirect('/admin/products');
        })
        .catch((error) => {
            console.log(error);
        })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit === 'true';

    if (!editMode) {
        return res.redirect('/');
    }

    const productID = req.params.productId;

    req.user.getProducts({where: {id: productID} , raw : true})
    // Product.findByPk(productID , {raw:true})
        .then( products=>{
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }

            res.render('admin/edit-product', {   // <-- FIXED path
                pageTitle: 'Edit Products',
                activeAddProduct: false,
                formsCSS: true,
                productCSS: true,
                product,
                editing: editMode,
                path: '/admin/edit-product'
            });
        })
        .catch( err=>{
            console.log(err)
        })
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId

    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;



    Product.findByPk(prodId , {raw:false })
        .then( product=>{
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save() // This returns a promise
        })
        .then(result=>{
            res.redirect('/admin/products')
            console.log("Updated Product !!!");
        })
        .catch( err=>{ // This catch block now handles both promises (findByPk & .save())
            console.log(err)
        })


}


exports.getAdminProducts = (req,res,next)=>{

    req.user.getProducts({raw : true})
        .then(products=>{
            res.render('admin/products',{
                products:products ,
                pageTitle : 'Shop' ,
                activeAdminProducts : true,
                productCSS : true,
                hasProducts: products.length > 0,
                path : "/" // FOR PUG
            })
        })
        .catch((error) => {
            console.log(error);
        })

}

// Delete
exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId


    Product.findByPk(productId , {raw:false})
    .then(product=>{
        if (!product) {
            res.redirect('/')
        }
        return product.destroy()
    })
    .then(result=>{
            console.log("Product Removed !")
            res.redirect('/admin/products')
        })
    .catch((error) => {
        console.log(error);
    })
}
