const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', async (request, response) => {
  const blogsList = await Blog.find({})
  response.json(blogsList)
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogRouter