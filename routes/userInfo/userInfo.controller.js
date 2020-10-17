var user = require('../../models/userInfo.model');


module.exports.addUser = (req, res, next) => {
    try {
        let result = new user(req.body);
        result.save(function (err) {
            if (!err)
                res.status(200).json({ id: result._id, userName: result.userName });
            else
                res.status(400).json(err);
        });
    } catch (err) { 
        res.status(400).json(err);
    }
};

module.exports.getUserInfo=(req, res, next) => {
    try { 
        let result = user.findOne({
            email: req.query.email,
            password: req.query.password
        });
        result.exec((err,data) => { 
            if (err) {
                throw err;
            }
            else { 
                res.status(200).json(data);
            }
        })
    }catch (err) { 
        res.status(400).json(err);
    }
};

module.exports.updateUserInfo=(req, res, next) => {

};

module.exports.deleteUser=(req, res, next) => {

};