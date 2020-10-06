const app = require('../app')
const supertest = require('supertest')
const helper = require('./test_helper')
const mongoose = require('mongoose')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
//const jwt = require('jsonwebtoken')
jest.setTimeout(10000) //the beforeEach takes some times so the async throws timeout



beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  let blogList = []
  let userList = []

  for(let user of helper.initialUsers){
    let userToPost = new User(user)
    let savedUser = await userToPost.save()
    userList.push(savedUser)
  }

  for(let blog of helper.initialBlogs){
    let blogToPost = new Blog(blog)
    let savedBlog = await blogToPost.save()
    blogList.push(savedBlog)
  }

  blogList[0].user = userList[0]._id
  blogList[1].user = userList[0]._id
  userList[0].blogs = [blogList[0]._id, blogList[1]._id]

  blogList[2].user = userList[1]._id
  blogList[3].user = userList[1]._id
  userList[1].blogs = [blogList[2]._id, blogList[3]._id]

  const userPromises = userList.map(user => user.save())
  const blogPromises = blogList.map(blog => blog.save())

  await Promise.all(userPromises)
  await Promise.all(blogPromises)
})


//-------------------------------BLOG----------------------------------------
describe('Blogs tests', () => {

  describe('get request tests', () => {
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
  })
  describe('post request tests', () => {
    test('should add a blog after a post request',async () => {
      const blog ={
        title: 'title 5',
        author: 'author 5',
        url: 'url 5',
        likes: 5,
      }

      const user ={
        username: 'username1',
        password: 'password1'
      }

      const loginResponse = await api.post('/api/login')
        .expect(200)
        .send(user)
        .expect('Content-Type', /application\/json/)


      await api.post('/api/blogs')
        .send(blog)
        .set({ Authorization: `bearer ${loginResponse.body.token}` })
        .expect(201)

      const blogList = await helper.blogsInDb()

      expect(blogList).toHaveLength(helper.initialBlogs.length + 1)

      const pure_blogs = blogList.map(i_blog => {
        return { title:i_blog.title, author:i_blog.author, url:i_blog.url, likes:i_blog.likes }
      })

      expect(pure_blogs).toContainEqual(blog)

    })

    test('on post if likes property is missing should default to 0', async () => {
      const blog ={
        title: 'title cerotest',
        author: 'author cerotest',
        url: 'url cerotest',
      }

      const user ={
        username: 'username1',
        password: 'password1'
      }

      const loginResponse = await api.post('/api/login')
        .expect(200)
        .send(user)
        .expect('Content-Type', /application\/json/)

      const resp_from_db = await api.post('/api/blogs')
        .send(blog)
        .set({ Authorization: `bearer ${loginResponse.body.token}` })
        .expect(201)

      expect(resp_from_db.body.likes).toEqual(0)

      const blogs = await helper.blogsInDb()
      expect( blogs.find(blog => {
        return blog.id === resp_from_db.body.id
      }
      ).likes
      ).toEqual(0)
    })

    test('should return error 400 on if title and url are missing', async () => {
      const blog = {
        author: 'author cerotest',
        likes: 3,
      }
      await api.post('/api/blogs')
        .send(blog)
        .expect(400)
    })
  })
  describe('delete request tests', () => {
    test('delete should work', async () => {
      const initialBlogs = await helper.blogsInDb()

      const user ={
        username: 'username1',
        password: 'password1'
      }

      const loginResponse = await api.post('/api/login')
        .expect(200)
        .send(user)
        .expect('Content-Type', /application\/json/)

      await api.delete(`/api/blogs/${initialBlogs[0].id}`)
        .expect(204)
        .set({ Authorization: `bearer ${loginResponse.body.token}` })

      const afterDeleteBlogs = await helper.blogsInDb()

      expect(afterDeleteBlogs).toHaveLength(initialBlogs.length - 1)
      const res = await Blog.findById(initialBlogs[0].id)
      expect(res).toEqual(null)
    })
  })

  describe('update request tests', () => {
    test('update request tests', async () => {
      const initialBlogs = await helper.blogsInDb()

      const resp_from_db = await api.put(`/api/blogs/${initialBlogs[0].id}`)
        .send({ likes: 777 })
        .expect(200)

      expect(resp_from_db.body.likes).toEqual(777)

      const updated_blog_0_in_db = await Blog.findById(initialBlogs[0].id)
      expect(updated_blog_0_in_db.likes).toEqual(777)
    })
  })

  describe('should return correct error in every case', () => {
    test('correct error when no token is provided',async () => {
      const blog ={
        title: 'title 5',
        author: 'author 5',
        url: 'url 5',
        likes: 5,
      }

      const response = await api.post('/api/blogs')
        .send(blog)
        .expect(401)

      expect(response.body.error).toEqual('token missing or invalid')

      const blogList = await helper.blogsInDb()

      expect(blogList).toHaveLength(helper.initialBlogs.length)
    })

    test('correct error when invalid token is provided', async () => {
      const blog ={
        title: 'title 5',
        author: 'author 5',
        url: 'url 5',
        likes: 5,
      }

      const response = await api.post('/api/blogs')
        .send(blog)
        .set({ Authorization: 'bearer anyblobstufff' })
        .expect(401)

      expect(response.body.error).toEqual('token missing or invalid')

      const blogList = await helper.blogsInDb()

      expect(blogList).toHaveLength(helper.initialBlogs.length)
    })
  })


})
//-------------------------------USER----------------------------------------

describe('User test', () => {

  describe('User Creation tests', () => {
    test('creating valid user', async () => {

      const newUser = {
        username: 'username3',
        password: 'password3',
        name: 'name3'
      }

      const startUserInDb = await helper.usersInDb()

      await api.post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const endUserInDb = await helper.usersInDb()
      expect(endUserInDb).toHaveLength(startUserInDb.length + 1)

      const usernames = endUserInDb.map(user => user.username)
      expect(usernames).toContain('username3')
    })

    test('creating invalid user, no username', async () => {

      const newUser = {
        password: 'password3',
        name: 'name3'
      }

      const startUserInDb = await helper.usersInDb()

      await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const endUserInDb = await helper.usersInDb()
      expect(endUserInDb).toHaveLength(startUserInDb.length)
    })

    test('creating invalid user, username must have length > 3', async () => {

      const newUser = {
        username: 'us',
        password: 'password3',
        name: 'name3'
      }

      const startUserInDb = await helper.usersInDb()

      await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const endUserInDb = await helper.usersInDb()
      expect(endUserInDb).toHaveLength(startUserInDb.length)
    })

    test('creating invalid user, username must be unique', async () => {

      const newUser = {
        username: 'username2',
        password: 'password3',
        name: 'name3'
      }

      const startUserInDb = await helper.usersInDb()

      await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const endUserInDb = await helper.usersInDb()
      expect(endUserInDb).toHaveLength(startUserInDb.length)
    })

    test('creating invalid user, password is required', async () => {

      const newUser = {
        username: 'username3',
        name: 'name3'
      }

      const startUserInDb = await helper.usersInDb()

      await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const endUserInDb = await helper.usersInDb()
      expect(endUserInDb).toHaveLength(startUserInDb.length)
    })

    test('creating invalid user, password must have length > 3', async () => {

      const newUser = {
        username: 'username3',
        password: 'as',
        name: 'name3'
      }

      const startUserInDb = await helper.usersInDb()

      await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const endUserInDb = await helper.usersInDb()
      expect(endUserInDb).toHaveLength(startUserInDb.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})