var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    projectName: { type: String, required: 'true' },
    projectDescription: { type: String },
    projectAdmin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    ],
    projectMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            default: undefined
        }
    ],
    projectData: { type: String },
    projectSnapshots: [
        {
            type: String,
            default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Project_Pinball.jpg/1200px-Project_Pinball.jpg'
        }
    ]
}, {timestamps:true});

module.exports= mongoose.model('Project',projectSchema);