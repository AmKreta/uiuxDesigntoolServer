var mongoose = require('mongoose');

var userInfoSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required:true },
    occupation: { type: String, enum: ['designer', 'client'], default: 'designer' },
    organisation: { type: String, default: 'freelancer' },
    description: { type: String, default: 'hello world!' },
    projects: {
        completed: { type: Number, default: 0 },
        current: { type: Number, default: 0 }
    },
    profilePic: {type:String,default:'https://semantic-ui.com/images/avatar/large/christian.jpg'}
}, { timestamps: true });

module.exports = mongoose.model('user',userInfoSchema);