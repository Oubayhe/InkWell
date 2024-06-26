const Comment = require('../models/comment.model')
const Post = require('../models/post.model')
const User = require('../models/user.model')
const errorHandler = require('../utils/error')
const mongoose = require('mongoose')

const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body

        if(userId !== req.user.id) {
            return next(errorHandler(403, 'You are not allowed to create this comment'))
        }

        const newComment = new Comment({
            content, 
            postId, 
            userId,
        })
        await newComment.save()

        res.status(200).json(newComment)
    } catch (error) {
        ext(error)
    }
}

const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId}).sort({
            createdAt: -1,
        })
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}

const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if(!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }
        const userIndex = comment.likes.indexOf(req.user.id)
        if (userIndex === -1) {
            comment.numberOfLikes += 1
            comment.likes.push(req.user.id)
        } else {
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1)
        }
        await comment.save()
        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}

const editComment = async (req, res, next) => {
    try {
        // Find the comment first, and see if it exists and if the user wanting to edit is the respective user of the comment.
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }
        if (comment.userId !== req.user.id) {
            return next(errorHandler(403, 'You are not allowed to edit this comment'))
        }
        // Now passing to the editing part
        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content,
            },
            { new: true }
        )
        res.status(200).json(editedComment)
    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }
        if (comment.userId !== req.user.id) {
            return next(errorHandler(403, 'You are not allowed to delete this comment'))
        }
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json('Comment has been deleted')
    } catch (error) {
        next(error)
    }
}

  
  



module.exports = {
    createComment,
    getPostComments,
    likeComment,
    editComment,
    deleteComment,
}