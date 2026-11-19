const express = require("express");
const multer = require("multer");
const musicController = require("../controllers/music.controller");
const authMiddleware=require("../middlewares/auth.middleware")
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/upload", authMiddleware.authArtist,upload.single("music"), musicController.createMusic);
router.post("/album", authMiddleware.authArtist,musicController.createAlbum)
router.get("/",authMiddleware.authUser,musicController.getAllMusics)
router.get("/albums",authMiddleware.authUser,musicController.getAllAlbums)
router.get("/albums/:albumId",authMiddleware.authUser,musicController.getAlbumById)
router.get("/search",authMiddleware.authAny,musicController.searchMusics)
router.get("/my-music",authMiddleware.authArtist,musicController.getMyMusic);
router.post("/like/:id",authMiddleware.authUser,musicController.likeSong);
router.post("/liked",authMiddleware.authUser,musicController.getLikedSongs);
router.put("/:id",authMiddleware.authArtist,musicController.updateMusic)
router.delete("/:id",authMiddleware.authArtist,musicController.deleteMusic);
router.put("/album/:albumId",authMiddleware.authArtist,musicController.updateAlbum);
router.get("/my-albums",authMiddleware.authArtist,musicController.getMyMusic);
router.delete("/album/:albumId",authMiddleware.authArtist,musicController.deleteAlbum);
router.post("/album/:albumId/songs",authMiddleware.authArtist,musicController.addSongToAlbum);
router.delete("/album/:albumId/songs/:musicId",authMiddleware.authArtist,musicController.removeSongFromAlbum);
module.exports = router;



