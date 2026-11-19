const playlistModel=require("../models/playlist.model");
async function createPlaylist(req,res){
    const {name}=req.body;
    if(!name){
        return res.status(400).json({message:"Name is required"});
    }
    const playlist = await playlistModel.create({
        name,
        owner:req.user.id,
    });
    res.status(201).json({message: "Playlist created",playlist});
}

async function getMyPlaylists(req,res){
    const playlists=await playlistModel.find({owner:req.user.id}).populate("musics");
    res.status(200).json({playlists});
}

async function addSong(req,res){
    const {playlistId}=req.params;
    const {musicId}=req.body;

    const playlist = await playlistModel.findOneAndUpdate(
        {_id:playlistId,owner:req.user.id},
        {$addToSet:{musics:musicId}},
        {new:true}
    );
    if(!playlist){
        return res.status(404).json({message:"Playlist not found"});
    }
    res.status(200).json({message:"Song removed",playlist});
}
async function removeSong(req, res) {
    const { playlistId, musicId } = req.params;

    const playlist = await playlistModel.findOneAndUpdate(
        { _id: playlistId, owner: req.user.id },
        { $pull: { musics: musicId } },
        { new: true }
    );
    if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json({ message: "Song removed", playlist });
}
async function deletePlaylist(req,res){
    const {playlistId}=req.params;

    const playlist = await playlistModel.findOneAndDelete({
        _id:playlistId,
        owner:req.user.id,
    });
    if(!playlist)
    {
        return res.status(404).json({message: "Playlist not found"});
    }
    res.status(200).json({message:"Playlist deleted"});
}

module.exports={createPlaylist, getMyPlaylists,addSong,deletePlaylist,removeSong}