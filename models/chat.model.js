var mongoose = require('mongoose');
const { stringify } = require('uuid');

var privateChatSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    attachment: { 
        type: { type: String },
        path: {type:String}
    }
}, { timestamps: true });


var chatList = new mongoose.Schema({
    chatType: { type: String, enum: ['group', 'private'], default: 'private' },
    chatId: { type: mongoose.Schema.ObjectId, required: true }
}, { _id: false }, { timeStamp: true })

var chatListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    chatList: [ chatList ]
})

var groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'common group' },
    admin: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    members: [{ type: mongoose.Schema.Types.ObjectId }],
    dp: {type:String,default:'https://fungistaaan.com/wp-content/uploads/2018/10/Funny-Pics-For-Whatsapp-Dp.jpg'}
}, { timestamp:true });

var groupChatSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    attachment: { 
        type: { type: String },
        path: {type:String}
    }
},{ timestamps: true });

module.exports.privateChat = mongoose.model('privateChat', privateChatSchema);
module.exports.groupChat = mongoose.model('groupChat', groupChatSchema);
module.exports.group = mongoose.model('group', groupSchema);
module.exports.chatList = mongoose.model('chatList',chatListSchema);