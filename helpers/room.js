/* eslint-disable indent */
import mongoose from 'mongoose';

const Rooms = mongoose.model('rooms')

/**
 * Helper Functions for Rooms
 */
const doesRoomExists = (roomName) => new Promise((resolve, reject) => {
    Rooms.find({ name: roomName }).exec((err, result) => {
        if (err) {
            reject(err);
        } else {
            if (result.length > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        }
    })
})
const addRoom = (roomName) => new Promise((resolve, reject) => {
    const newRoom = new Rooms({ name: roomName });
    newRoom.save((err, result) => {
        err ? reject(err) : resolve(result)
    })
})
const getAllRooms = () => new Promise((resolve, reject) => {
    Rooms.find({}).exec((err, result) => {
        err ? reject(err) : resolve(result)
    })
})
export {
    doesRoomExists,
    addRoom,
    getAllRooms
}
