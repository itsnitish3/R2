const MeetingModel = require('../models/')
const services = {
  getMeetings: async () => {
    try {
      const data = await MeetingModel.find().lean()
      return data
    } catch (error) {
      return null
    }
  },
  createMeeting: async obj => {
    try {
      const data = new MeetingModel(obj)

      const result = await data.save()

      return result
    } catch (error) {
      return null
    }
  },
  getMeetingByDate: async date => {
    try {
      const data = await MeetingModel.find({ date: date }).lean()

      return data
    } catch (error) {
      return null
    }
  },
  getAllMeeting: async () => {
    try {
      const data = await MeetingModel.find({ isdeleted: false }).lean()
      return data
    } catch (error) {
      return null
    }
  },
  deleteMeeting: async meetingId => {
    try {
      const data = await MeetingModel.findOneAndUpdate(
        { meetingId: meetingId },
        { isdeleted: true },
        { new: true }
      )
      return data
    } catch (error) {
      return null
    }
  },
  getMeetingById: async meetingId => {
    try {
      const data = await MeetingModel.findOne({ meetingId: meetingId }).lean()
      return data
    } catch (error) {
      return null
    }
  },
  updateMeeting: async (id, obj) => {
    try {
      const data = await MeetingModel.findOneAndUpdate({ meetingId: id }, obj)
      return data
    } catch (error) {
      return null
    }
  },
  checkOverlapse: async (startTime, endTime) => {
    try {
      const data = await MeetingModel.find({
        isdeleted: false,
        $or: [
          {
            $and: [
              { startTime: { $lte: startTime } },
              { endTime: { $gte: startTime } }
            ]
          },
          {
            $and: [
              { startTime: { $lte: endTime } },
              { endTime: { $gte: endTime } }
            ]
          },
          {
            $and: [
              { startTime: { $gte: startTime } },
              { endTime: { $lte: endTime } }
            ]
          }
        ]
      })
      return data
    } catch (error) {
      return null
    }
  }
}
module.exports = services
