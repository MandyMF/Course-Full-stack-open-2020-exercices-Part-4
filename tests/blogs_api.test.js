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

test('Returns correct amount of blogs in json format', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsDb = await helper.blogsInDb()
  expect(blogsDb).toHaveLength(helper.initialBlogs.length)
})

test('Blog post identifier property is named id and exist for every blog', async () => {
  const blogsDb = await helper.blogsInDb()

  blogsDb.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('should add a blog after a post request',async () => {
  const blog ={
    title: 'title 5',
    author: 'author 5',
    url: 'url 5',
    likes: 5
  }

  await api.post('/api/blogs')
    .send(blog)
    .expect(201)
  const blogList = await helper.blogsInDb()

  expect(blogList).toHaveLength(helper.initialBlogs.length + 1)

  const pure_blogs = blogList.map(i_blog => {
    return { title:i_blog.title, author:i_blog.author, url:i_blog.url, likes:i_blog.likes }
  })

  expect(pure_blogs).toContainEqual(blog)

})



afterAll(() => {
  mongoose.connection.close()
})