const Blog = require('../models/blog')

const initialBlogs = [
  {
    title : 'title 1',
    author: 'author 1',
    url: 'url 1',
    likes: 1
  },
  {
    title: 'title 2',
    author: 'author 2',
    url: 'url 2',
    likes: 2
  },
  {
    title: 'title 3',
    author: 'author 3',
    url: 'url 3',
    likes: 3
  },
  {
    title: 'title 4',
    author: 'author 4',
    url: 'url 4',
    likes: 4
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})

  return blogs.map(blog => blog.toJSON())
}

module.exports={ initialBlogs, blogsInDb }