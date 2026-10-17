
const express = require("express");

const {
    listPassages,
    getPassage,
} = require("../controllers/passageController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, listPassages);
router.get("/:id", protect, getPassage);

module.exports = router;
