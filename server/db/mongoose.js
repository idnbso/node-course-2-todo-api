const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://10.0.0.13:27017/TodoApp');

module.exports = {
    mongoose
};