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
            default: [{
                url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvOhjemRGwgin-OfscF_9897HTfaTECNz3CA&usqp=CAU',
                caption: 'default-image'
            }],
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