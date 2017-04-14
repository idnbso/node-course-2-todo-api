const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://10.0.0.13:27017/TodoApp');

module.exports = {
    mongoose
};