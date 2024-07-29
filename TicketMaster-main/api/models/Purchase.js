const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentType: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
