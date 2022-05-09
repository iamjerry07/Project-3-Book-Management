const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
        required: true
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        trim: true
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 5,
        required: true
    },
    review: {
        type: String,
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = mongoose.model('Review', reviewSchema);

// {
//     bookId: { ObjectId, mandatory, refs to book model },
//     reviewedBy: {
//         string,
//         mandatory,
//         default 'Guest',
//         value: reviewer 's name},
//         reviewedAt: { Date, mandatory },
//         rating: { number, min 1, max 5, mandatory },
//         review: { string, optional }
//         isDeleted: { boolean, default: false },
//     }