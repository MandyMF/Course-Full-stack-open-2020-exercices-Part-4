const User = require('../models/user')
const helper = require('./test_helper')
const mongoose= require('mongoose')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const userList = helper.initialUsers.map(user => new User(user))
  const userPromiseList = userList.map(user => user.save())
  await Promise.all(userPromiseList)

})

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



afterAll(() => {
  mongoose.connection.close()
})