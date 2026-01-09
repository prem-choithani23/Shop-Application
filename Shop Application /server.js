const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');

const { sequelize, Product, User } = require('./models'); // import everything from models/index.js
const errorController = require('./controllers/errors');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();
const PORT = 3241;


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Attach default user
app.use(async (req, res, next) => {

    User.findByPk(1 )
        .then(user => {
            req.user = user;
            next();
        })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.pageNotFoundPage);

// Sync and start server
sequelize
    .sync()
    .then(() => {
        return User.findByPk(1)
    })
    .then(user => {
        if(!user)
            return User.create({ name: "Prem" , email:"test@test.com"});
        return user
    })
    .then((user) => {
        return user.createCart()

    }).then((cart) => {
        console.log("Dummy Cart for dummy user created !")
        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
})
    .catch(err => console.error("DB Sync Error:", err));
