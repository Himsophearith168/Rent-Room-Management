const express = require("express");
const router = express.Router();

const roomAssign = require("../controller/roomAssign");

router.get("/", roomAssign.getAssignments);
router.get("/:id", roomAssign.getAssignmentByID);
router.post("/", roomAssign.createAssignment);
router.put("/:id", roomAssign.updateAssignment);
router.put("/:id/end", roomAssign.endAssignment);
router.delete("/:id", roomAssign.deleteAssignment);

module.exports = router;