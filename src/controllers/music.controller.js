const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");
const userModel = require("../models/user.model");

async function createMusic(req, res) {
  const title = req.body?.title;
  const file = req.file;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (!file) {
    return res.status(400).json({ message: "Audio file is required" });
  }

  const result = await uploadFile(file.buffer);

  const music = await musicModel.create({
    uri: result.secure_url,
    title,
    artist: req.user.id,
  });

  return res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
}

async function createAlbum(req, res) {
  const { title, musics } = req.body;
  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musics,
  });
  res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    },
  });
}

async function getAllMusics(req, res) {
  const musics = await musicModel.find();
  res.status(200).json({
    message: "Musics fetched successfully",
    musics: musics,
  });
}

async function getAllAlbums(req, res) {
  const albums = await albumModel
    .find()
    .populate("artist", "username email")
    .populate("musics");
  res.status(200).json({
    message: "Albums fetched successfully",
    albums: albums,
  });
}

async function getAlbumById(req, res) {
    const albumId = req.params.albumId;
    const album = await albumModel
        .findById(albumId)
        .populate("artist", "username email")
        .populate("musics");

    if (!album) {
        return res.status(404).json({ message: "Album not found" });
    }

    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    });
}
async function searchMusics(req,res){
  const q=req.query.q;
  if(!q){
    return res.status(400).json({message: "Search query is required"});
  }
  const musics=await musicModel.find({title:{$regex:q,$options:"i"}})
  .populate("artist","username");

  res.status(200).json({
    message:"Search results",
    musics:musics,
  });
}
async function getMyMusic(req,res){
  try{
    const musics=await musicModel.find({artist:req.user.id})
    .populate("artist","username");
    res.status(200).json({message:"My musics fetched successfully",musics});
  }catch(err){
    res.status(500).json({message:"Server error"});
  }
}
async function likeSong(req,res){
  try{
    const songId=req.params.id;
    const song=await musicModel.findById(songId);  // finding liked song id from database
    if(!song){
      return res.status(404).json({message:"Song not found"});
    }
    const user=await userModel.findById(req.user.id); // finding the loggedIn user from authenticated user currently
    const alreadyLiked=user.likedSongs.includes(songId);

    if(alreadyLiked){
      user.likedSongs.pull(songId);
    }
    else{
      user.likedSongs.push(songId);
    }
    await user.save();
    res.status(200).json({
      message:alreadyLiked ?  "Song unliked":"Song liked",
    });
  }
  catch(err){
    res.status(500).json({message: "Server error"});
  }
}
async function getLikedSongs(req,res){
  try{
    const user=await userModel.findById(req.user.id).populate({
      path:"likedSongs",
      populate:{path:"artist",select:"username"},
    })
    res.status(200).json({
      message:"Liked Songs fetched successfully",
      musics:user.likedSongs,
    });
  }catch(err){
    res.status(500).json({message:"Server error"});
  }
}
async function updateMusic(req, res) {
  try {
    const  {title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const music = await musicModel.findOneAndUpdate(
      { _id: req.params.id, artist: req.user.id },
      { title },
      { new: true }
    );

    if (!music) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json({
      message: "Song updated successfully",
      music: music,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
}
async function deleteMusic(req,res){
  try{
    const music=await musicModel.findOneAndDelete({
      _id:req.params.id,
      artist:req.user.id,
    });
    if(!music){
      return res.status(404).json({message:"Song not found"});
    }
    res.status(200).json({message:"Song deleted successfully"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"Server error"});
  }
}
async function updateAlbum(req,res){
  try{
    const {title} = req.body;
    if(!title){
      return res.status(400).json({message:"Title is required"});
    }
    const album=await albumModel.findOneAndUpdate(
      {
        _id:req.params.albumId,artist:req.user.id},
        {title},
        {returnDocument:"after"}
      
    );
    if(!album){
      return res.status(404).json({message:"Album not found"});
    }
    res.status(200).json(
      {
        message:"Album updated successfully",
        album:album,
      });
  }catch(err){
    console.log(err);
    res.status(500).json({message:"Server error"});
  }
}
async function getMyAlbums(req,res){
  try{
    const albums=await albumModel.find({artist:req.user.id}).populate("musics");
    res.status(200).json({
      message:"My albums fetched successfully",
      albums:albums,
    })
  }catch(err){
    console.log(err);
    res.status(500).json({message:"Server error"});
}
}
async function deleteAlbum(req,res){
  try{
    const album=await albumModel.findOneAndDelete({
      _id:req.params.albumId,
      artist:req.user.id,
    });
    if(!album){
      return res.status(404).json({message:"Album not found"});
    }
    res.status(200).json({message:"Album deleted successfully"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"Server error"});
  }
}
async function addSongToAlbum(req, res) {
  try {
    const { albumId } = req.params;
    const { musicId } = req.body;

    if (!musicId) {
      return res.status(400).json({ message: "musicId is required" });
    }

    const music = await musicModel.findOne({ _id: musicId, artist: req.user.id });
    if (!music) {
      return res.status(404).json({ message: "Song not found" });
    }

    const album = await albumModel.findOneAndUpdate(
      { _id: albumId, artist: req.user.id },
      { $addToSet: { musics: musicId } },
      { returnDocument: "after" }
    );
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json({ message: "Song added to album", album });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}
async function removeSongFromAlbum(req,res){
  try{
    const {albumId,musicId}=req.params;
    const album = await albumModel.findOneAndDelete(
      {_id:albumId,artist:req.user.id},
      {$pull},{musics:musicId},
      {returnDocument:"after"}    
    );
    if(!album){
      return res.status(400).json({message:"Album not found"});
    }
    res.status(200).json({message:"Song removed successfully"});
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({message:"Server error"});
  }

}
module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums,getAlbumById,searchMusics,getMyMusic,likeSong,getLikedSongs,updateMusic,deleteMusic,updateAlbum,getMyAlbums,deleteAlbum,addSongToAlbum,removeSongFromAlbum};
