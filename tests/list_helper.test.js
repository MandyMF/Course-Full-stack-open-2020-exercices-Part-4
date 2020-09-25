const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
//36 likes
const listWithManyBlogs = [
  { _id: '5a422a851b54a676234d17f7', title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7, __v: 0 },
  { _id: '5a422aa71b54a676234d17f8', title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5, __v: 0 },
  { _id: '5a422b3a1b54a676234d17f9', title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12, __v: 0 },
  { _id: '5a422b891b54a676234d17fa', title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10, __v: 0 },
  { _id: '5a422ba71b54a676234d17fb', title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0, __v: 0 },
  { _id: '5a422bc61b54a676234d17fc', title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2, __v: 0 }
]

const listWithNoBlogs = []

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithNoBlogs)
    expect(result).toBe(0)
  })
})

describe('favorite blog', () =>
{

  test('when list has only one blog, that one has to be the result', () => {
    const res = listHelper.favoriteBlog(listWithOneBlog)
    expect(res).toEqual(
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    )
  })

  test('of a list of many blogs, is the third one on the list', () => {
    const res = listHelper.favoriteBlog(listWithManyBlogs)
    expect(res).toEqual(
      listWithManyBlogs[2]
    )
  })

  test('when is an empty list, is null',() => {
    const res = listHelper.favoriteBlog(listWithNoBlogs)
    expect(res).toEqual(null)
  })
})
describe('Author with most blogs', () =>
{
  test('when list has only one blog, has to return the author with just one blog',() => {
    const res =listHelper.mostBlogs(listWithOneBlog)

    expect(res).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        blogs:1
      }
    )
  })

  test('when list is empty, return null', () => {
    const res = listHelper.mostBlogs(listWithNoBlogs)

    expect(res).toEqual(null)
  })

  test('when list has many, return the author name and number of blogs of the author with the largest amount of blogs',() => {
    const res = listHelper.mostBlogs(listWithManyBlogs)

    expect(res).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('Author with most likes total', () => {
  test('when the list has many blogs, is the author name and total amount of likes of the author with the highest amount of likes total',() => {
    const res = listHelper.mostLikes(listWithManyBlogs)

    expect(res).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

  test('when the list has one blog, should return the only author there is, and the likes of the blog', () => {
    const res = listHelper.mostLikes(listWithOneBlog)

    expect(res).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when the list is empty, should return null', () => {
    const res = listHelper.mostLikes(listWithNoBlogs)

    expect(res).toEqual(null)
  })
})


