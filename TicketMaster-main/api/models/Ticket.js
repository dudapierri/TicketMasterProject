const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    price: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    eventDate: {
        type: Date,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: null
    },
    capacity: {
        type: Number,
        default: null
    },
    image64: {
        type: String,
        default: null
    },
    remaining: {
        type: Number,
        default: null
    }
}, { collection: 'Tickets' });

module.exports = mongoose.model('Ticket', ticketSchema);
