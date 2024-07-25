const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    dsaId: { type: String, required: true },
    rating: { type: Number, required: true },
    serviceQuality: { type: String, required: true },
    textFeedback: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Customer_Feedback', FeedbackSchema);

module.exports = Feedback;
