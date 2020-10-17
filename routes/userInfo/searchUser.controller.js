var user = require('../../models/userInfo.model');

module.exports.searchUser = (req, res, next) => { 
    try {
        var result = user.find({
            $or: [
                { firstName: {$regex:`${req.query.search}`}},
                { lastName: { $regex: `${req.query.search}` } },
                { userName: { $regex: `${req.query.search}` } }
            ]
        }, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 });
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