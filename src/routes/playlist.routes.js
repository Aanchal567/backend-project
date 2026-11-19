const express = require("express");
const playlistController = require("../controllers/playlist.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", authMiddleware.authUser, playlistController.createPlaylist);
router.get("/", authMiddleware.authUser, playlistController.getMyPlaylists);
router.post("/:playlistId/songs", authMiddleware.authUser, playlistController.addSong);
router.delete("/:playlistId/songs/:musicId", authMiddleware.authUser, playlistController.removeSong);
router.delete("/:playlistId", authMiddleware.authUser, playlistController.deletePlaylist);

module.exports = router;