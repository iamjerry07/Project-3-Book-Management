const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: 'Books',
        required: true
    },
    reviewedBy: {
        type: String,
        default: 'Guest',
        required: true,
        trim: true
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String,
        trim: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
}); { timestamps: true };

module.exports = mongoose.model('Review', reviewSchema);

// const mongoose = require('mongoose')

// const ObjectId = mongoose.Schema.Types.ObjectId

// const reviewModel = new mongoose.Schema({


//     bookId: {
//         type: ObjectId,
//         required: true,
//         ref: "Book"
//     },
//     reviewedBy: {
//         type: String,
//         required: true,
//         default: "Guest",
//         trim: true

//     },
//     reviewedAt: {
//         type: Date,
//         required: true
//     },
//     rating: {
//         type: Number,
//         min: 1,
//         max: 5,
//         required: true
//     },
//     review: {
//         type: String,
//         trim: true
//     },
//     isDeleted: {
//         type: Boolean,
//         default: false
//     },
// })

// module.exports = mongoose.model("review", reviewModel)
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