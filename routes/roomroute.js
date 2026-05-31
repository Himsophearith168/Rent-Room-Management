const express = require('express')
const router = express.Router()
const room = require("../controller/roomController")

router.get('/', room.getRoom)
router.get('/:id', room.getRoomByID)
router.post('/', room.createRoom)
router.put('/:id', room.updateRoom)
router.delete('/:id', room.deleteRoom)

module.exports = router;