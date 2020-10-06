const User = require('../models/user')
const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  const usersList = await User.find({}).populate('blogs', { url:1, title:1, author:1, id:1 })
  response.json(usersList)
})

userRouter.post('/', async (request, response) => {
  const body = request.body

  if(body.password === undefined)
  {
    return response.status(400).json({
      error: 'Password validation failed: password: Path `password` is required.'
    })
  }
  else if(body.password.length < 3)
  {
    return response.status(400).json({
      error:  `Password validation failed: password: Path \`password\` (\`${body.password}\`) is shorter than the minimum allowed length (3).`
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const newUser = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await newUser.save()

  return response.json(savedUser)
})

module.exports= userRouter