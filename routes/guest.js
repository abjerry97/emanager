const Controller = require('../controllers/controller')
const express = require('express')
const { isAuth, travelMode } = require('../utils/Middleware/Middleware')

const guestRoute = express.Router()

guestRoute
  .route('/')
  .all((req, res, next) => {
    next()
  })
  .get((req, res, next) => {
    res.send('<h1> Welcome guest to Estate Management </h1>')
  })

guestRoute.route('/passes').get(isAuth, travelMode, (req, res, next) => {
  return new Controller(req, res, next).getPasses()
})

guestRoute
  .route('/passes/:passId/send')
  .post(isAuth, travelMode, (req, res, next) => {
    return new Controller(req, res, next).sendPass()
  })
  guestRoute
    .route('/:guestId/delete')
    .delete(isAuth, travelMode, (req, res, next) => {
      return new Controller(req, res, next).deleteGuest()
    })

  
guestRoute
  .route('/passes/:passId/email/send')
  .post(isAuth, (req, res, next) => {
    return new Controller(req, res, next).sendPassEmail()
  })
guestRoute.route('/passes/:passId/sms/send').post(isAuth, (req, res, next) => {
  return new Controller(req, res, next).sendPassSms()
})

guestRoute.route('/guests').get(isAuth, travelMode, (req, res, next) => {
  return new Controller(req, res, next).getGuests()
})

guestRoute.route('/create/taxi').post(isAuth, travelMode, (req, res, next) => {
  return new Controller(req, res, next).createGuest(0)
})

guestRoute.route('/update/pass').post(isAuth, travelMode, (req, res, next) => {
  return new Controller(req, res, next).updateGuest()
})

guestRoute.route('/create/rider').post(isAuth, travelMode, (req, res, next) => {
  return new Controller(req, res, next).createGuest(1)
})

guestRoute.route('/create/guest').post(isAuth, travelMode, (req, res, next) => {
  return new Controller(req, res, next).createGuest(2)
})

guestRoute.route('/create/event').post(isAuth, travelMode, (req, res, next) => {
  return new Controller(req, res, next).createGuest(3)
})

module.exports = { guestRoute }
