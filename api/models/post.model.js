const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    }
})

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        images: {
            type: [imageSchema],
        },
        category: {
            type: String,
            default: 'uncategorized'
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    }, { timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)