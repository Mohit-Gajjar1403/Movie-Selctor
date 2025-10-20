const mongoose=require('mongoose');

const watchlistSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    movies:[{
        movieId: {
          type: String, 
          required: true
        },
        title: {
          type: String,
          required: true
        },
        poster: {
          type: String 
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }],
},
{ timestamps: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);