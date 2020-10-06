const Blog = require('../models/blog')
const User = require('../models/user')
const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogsList = await Blog.find({}).populate('user', { username: 1 , name:1, id:1 })
  response.json(blogsList)
})

blogRouter.post('/', async (request, response) => {

  if(request.body.title === undefined && request.body.url === undefined)
  {
    response.status(400).end()
    return
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!request.token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({ ...request.body, user: user.id })

  if(request.body.likes === undefined)
  {
    blog.likes=0
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!request.token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blogToDelete = await Blog.findById(request.params.id)

  if(blogToDelete.user.toString() === decodedToken.id.toString())
  {
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }
  else{
    return response.status(401).json({ error: `the user ${decodedToken.username} is not allowed to do this action on this blog` })
  }
})

blogRouter.put('/:id', async (request, response, next) => {

  try
  {
    const update_blog = await Blog.findByIdAndUpdate(request.params.id, { likes: request.body.likes } , { new: true })
    response.json(update_blog)
  }
  catch(exception){
    next(exception)
  }
})

module.exports = blogRouter