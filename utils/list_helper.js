const lodash = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = ( blogs ) => {
  return 1
}

const totalLikes = ( blogs ) => {
  const reducer = (sum, cur) => {
    return sum += cur.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog=(blogs) => {
  const reducer = (acc, cur) => {
    return cur.likes > acc.likes ? cur : acc
  }

  if(blogs.length === 0) return null

  const result = blogs.reduce(reducer, blogs[0])

  delete result._id
  delete result.__v
  delete result.url

  return result
}

const mostBlogs=(blogs) => {
  if(blogs.length===0)
    return null

  const author_grouped_list = Object.entries(lodash.groupBy(blogs, 'author'))
    .map(([key, value]) => {
      return {
        author: key,
        blogs: value.length
      }
    })

  return lodash.maxBy(author_grouped_list, 'blogs')
}

const mostLikes =(blogs) => {
  if(blogs.length===0)
    return null

  const author_grouped_list = Object.entries(lodash.groupBy(blogs, 'author'))
    .map(([key, value]) => {
      const total_likes = value.reduce((acc, cur) => {
        return acc + cur.likes
      }, 0)
      return {
        author: key,
        likes: total_likes
      }
    })

  return lodash.maxBy(author_grouped_list, 'likes')
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}