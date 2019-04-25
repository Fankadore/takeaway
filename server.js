const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./keys.js');
const corsHeaders = require('./middleware/corsHeaders.js');
const menuRoutes = require('./routes/menuRoutes.js');
const accountRoutes = require('./routes/accounts.js');
const orderRoutes = require('./routes/orders.js');
const port = process.env.PORT || 2000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(corsHeaders);

app.use('/menu', menuRoutes);
app.use('/account', accountRoutes);
app.use('/order', orderRoutes);

mongoose.connect(`mongodb://${keys.mongo.user}:${keys.mongo.pass}@ds229186.mlab.com:29186/takeaway`, {useNewUrlParser: true});
app.listen(port, () => console.log(`Server listening on port ${port}`));
