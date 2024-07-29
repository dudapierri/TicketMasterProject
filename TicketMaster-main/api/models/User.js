const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const authentication = require('../services/authentication');

const userSchema = new Schema({
    name: {
        type: String,
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { collection: 'Users' });

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
      }

    const newPass = await authentication.hashPassword(this.password);
    if (newPass.error) {
        return new Promise((resolve, reject) => {
            reject(new Error(newPass.message));
        });
    }
    this.password = newPass.result;
    next();
});

module.exports = mongoose.model('User', userSchema);
