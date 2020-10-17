var user = require('../../models/userInfo.model');

module.exports.getUserById = (req, res, next) => { 
    try {
        var result = user.findOne(
            { _id: req.query.userId },
            { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }
        );
        result.exec(function (err, data) {
            if (err) {
                throw err;
            } else { 
                res.status(200).json(data);
            }
        });
    } catch (err) { 
        res.status(400).json(err); 
    }
}