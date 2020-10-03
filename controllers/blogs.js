const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', async (request, response) => {
  const blogsList = await Blog.find({})
  response.json(blogsList)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()

  response.status(201).json(result)
})

module.exports = blogRouter