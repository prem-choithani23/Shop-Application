const sequelize = require('../util/database');
const { DataTypes, Sequelize} = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false }
});

const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    price: { type: DataTypes.DOUBLE, allowNull: false },
    imageUrl: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false }
});


const Cart = sequelize.define('cart', {
    id: { type: DataTypes.INTEGER, allowNull: false , primaryKey: true , autoIncrement: true },
})

const CartItem = sequelize.define('cartItem', {
    id: { type: DataTypes.INTEGER, allowNull: false , primaryKey: true , autoIncrement:true },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
})

const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, allowNull: false , primaryKey: true , autoIncrement:true},
    productsData : {type: DataTypes.JSON, allowNull: false},
})

const OrderItem = sequelize.define('orderItem', {
    id: { type: DataTypes.INTEGER, allowNull: false , primaryKey: true , autoIncrement:true},
})


// Associations
Product.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product , {through: CartItem})
Product.belongsToMany(Cart , {through: CartItem})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product , {through : OrderItem})


module.exports = {
    sequelize,
    User,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
};
