const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', async (request, response) => {
  const blogsList = await Blog.find({})
  response.json(blogsList)
})

blogRouter.post('/', async (request, response) => {

  if(request.body.title === undefined && request.body.url === undefined)
  {
    response.status(400).end()
    return
  }

  const blog = new Blog(request.body)

  if(request.body.likes === undefined)
  {
    blog.likes=0
  }

  const result = await blog.save()

  response.status(201).json(result)
})

module.exports = blogRouter