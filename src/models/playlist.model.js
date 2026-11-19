const mongoose = require("mongoose");
const playlistSchema=new mongoose.Schema({
    name:{
    type: String,
    required:true,
},
musics:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"music",
}],
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    requried: true,
},
});
const playlistModel=mongoose.model("playlist",playlistSchema);
module.exports=playlistModel;