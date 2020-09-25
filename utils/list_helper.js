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

  return blogs.length > 0 ? blogs.reduce(reducer, blogs[0]) : null
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



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}