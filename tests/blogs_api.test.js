const app = require('../app')
const supertest = require('supertest')
const helper = require('./test_helper')
const mongoose = require('mongoose')

const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})

  /*for(let blog of helper.initialBlogs){
    let blogToPost = new Blog(blog)
    await blogToPost.save()
  }*/

  const blogList = helper.initialBlogs.map((blog) => new Blog(blog))
  const blogPromises = blogList.map(blog => blog.save())
  await Promise.all(blogPromises)
})

test.only('Returns correct amount of blogs in json format', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsDb = await helper.blogsInDb()
  expect(blogsDb).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})