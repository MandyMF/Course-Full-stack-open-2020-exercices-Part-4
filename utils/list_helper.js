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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}