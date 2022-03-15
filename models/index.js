const mongoose = require('mongoose')
const Schema = mongoose.Schema
const meetingSchema = new Schema({
  date: String,
  start: String,
  end: String,
  startTime: Number,
  endTime: Number,
  meetingId: String,
  isdeleted: Boolean
})

const MeetingModel = mongoose.model('meetings', meetingSchema)
module.exports = MeetingModel
