const express = require('express')
const router = express.Router()
const controllers = require('./controllers')

router.post('/createMeeting', controllers.createMeeting)
router.post('/getMeetingByDate', controllers.getMeetingByDate)
router.get('/getAllMeeting', controllers.getAllMeeting)
router.get('/deleteMeeting/:meetingId', controllers.deleteMeeting)
router.post('/updateMeeting', controllers.updateMeeting)
router.post('/bulkDelte', controllers.bulkDelte)
module.exports = router
