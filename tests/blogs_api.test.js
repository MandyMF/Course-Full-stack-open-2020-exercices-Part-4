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

  test('on post if likes property is missing should default to 0', async () => {
    const blog ={
      title: 'title cerotest',
      author: 'author cerotest',
      url: 'url cerotest',
    }

    const resp_from_db = await api.post('/api/blogs')
      .send(blog)

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

    await api.delete(`/api/blogs/${initialBlogs[0].id}`)
      .expect(204)

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
afterAll(() => {
  mongoose.connection.close()
})