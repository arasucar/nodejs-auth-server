const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret)
}

exports.signup = function (req, res, next) {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(422).send({error: 'Email and password must be provided.'})
  }

  console.log(req.body)

  User.findOne({email: email}, function(err, existingUser) {
    if (err) { return next(err) }

    if (existingUser) {
      return res.status(422).send({error: 'Email is in use.'})
    }

    const user = new User({
      email: email,
      password: password
    })

    user.save(function (err) {
      if (err) { return next(err) }

      res.send({ token: tokenForUser(user) })
    })
  })
}

exports.signin = function (req, res, next) {
  res.send({token: tokenForUser(req.user)})
}