const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
	userId:{
		type:Schema.Types.ObjectId,
		required:true
	},
	storyId:{
		type:Schema.Types.ObjectId,
		required:true
	}
})

mongoose.model('likes',LikeSchema);