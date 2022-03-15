const { nanoid } = require('nanoid')
const services = require('../services')
const controllers = {
  createMeeting: async (req, res) => {
    try {
      const { startTime, endTime } = req.body
      if (!startTime || !endTime) {
        throw new Error('startTime or endTime is required')
      }
      if (endTime < startTime) {
        throw new Error('endTime must be greater than startTime')
      }
      if (getDate(startTime) !== getDate(endTime)) {
        throw new Error('startTime and endTime must be in the same day')
      }
      const start = getTime(startTime)
      const end = getTime(endTime)
      const overlapse = await services.checkOverlapse(startTime, endTime)

      if (overlapse.length > 0) {
        throw new Error('overlapse time')
      } else {
        const data = {
          date: getDate(startTime),
          startTime,
          endTime,
          start,
          end,
          isdeleted: false,
          meetingId: nanoid(6)
        }
        const result = await services.createMeeting(data)

        const response = {
          status: 'success',
          data: result
        }
        return res.status(200).send(response)
      }
    } catch (error) {
      const response = {
        status: 'error',
        message: error.message
      }
      return res.status(400).send(response)
    }
  },
  getMeetingByDate: async (req, res) => {
    try {
      const date = req.body.date
      const data = await services.getMeetingByDate(date)
      const response = {
        status: 'success',
        data: data
      }
      return res.status(200).send(response)
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  getAllMeeting: async (req, res) => {
    try {
      const data = await services.getAllMeeting()

      const response = {
        status: 'success',
        data: data
      }
      return res.status(200).send(response)
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  deleteMeeting: async (req, res) => {
    try {
      const meetingId = req.params.meetingId
      const data = await services.getMeetingById(meetingId)

      if (!data) {
        throw new Error('meetingId is not found')
      }

      if (data.startTime < Date.now()) {
        throw new Error('Meeting is already started')
      } else {
        await services.deleteMeeting(meetingId)
      }
      const response = {
        status: 'success',
        message: 'Meeting is deleted'
      }
      return res.status(200).send(response)
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  updateMeeting: async (req, res) => {
    try {
      const { startTime, endTime, meetingId } = req.body
      if (!startTime || !endTime) {
        throw new Error('startTime or endTime is required')
      }
      if (endTime < startTime) {
        throw new Error('endTime must be greater than startTime')
      }
      if (getDate(startTime) !== getDate(endTime)) {
        throw new Error('startTime and endTime must be in the same day')
      }
      const start = getTime(startTime)
      const end = getTime(endTime)
      const data = {
        startTime,
        endTime,
        start,
        end
      }
      const result = await services.updateMeeting(meetingId, data)
      const response = {
        status: 'success',
        data: result
      }
      return res.status(200).send(response)
    } catch (error) {
      const response = {
        status: 'error',
        message: error.message
      }
      return res.status(400).send(response)
    }
  },
  bulkDelte: async (req, res) => {
    try {
      const { meetingIds } = req.body
      const valid = []
      const invalid = []
      for (let i = 0; i < meetingIds.length; i++) {
        const meetingId = meetingIds[i]

        const data = await services.getMeetingById(meetingId.meetingId)
        if (!data) {
          invalid.push(meetingId)
        } else {
          if (data.startTime < Date.now()) {
            invalid.push(meetingId)
          } else {
            valid.push(meetingId)
          }
        }
      }
      valid.forEach(async meetingId => {
        await services.deleteMeeting(meetingId.meetingId)
      })
      const response = {
        status: 'success',
        message: 'deleted ',
        valid,
        invalid
      }
      return res.status(200).send(response)
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  bulkUpdate: async (req, res) => {
    try {
      const { meetings } = req.body
      const valid = []
      const invalid = []
      for (let i = 0; i < meetings.length; i++) {
        const meeting = meetings[i]
        const data = await services.getMeetingById(meeting.meetingId)
        if (!data) {
          invalid.push(meeting)
        } else {
          if (data.startTime < Date.now()) {
            invalid.push(meeting)
          } else {
            valid.push(meeting)
          }
        }
      }
      valid.forEach(async (meeting, index, object) => {
        if (meeting.startTime && meeting.endTime) {
          const start = getTime(meeting.startTime)
          const end = getTime(meeting.endTime)
          const data = {
            startTime: meeting.startTime,
            endTime: meeting.endTime,
            start,
            end
          }
          const overlapse = await services.checkOverlapse(
            meeting.startTime,
            meeting.endTime
          )
          if (overlapse.length > 0) {
            invalid.push(meeting)
            object.splice(index, 1)
          } else {
            await services.updateMeeting(meeting.meetingId, data)
          }
        }
      })
      const response = {
        status: 'success',
        message: 'updated ',
        valid,
        invalid
      }
      return res.status(200).send(response)
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}
module.exports = controllers

const getDate = time => {
  const date = new Date(time).getDate()
  const month = new Date(time).getMonth() + 1
  const year = new Date(time).getFullYear()
  return `${date}/${month}/${year}`
}
const getTime = time => {
  const hour = new Date(time).getHours()
  const minute = new Date(time).getMinutes()
  return `${hour}:${minute}`
}
