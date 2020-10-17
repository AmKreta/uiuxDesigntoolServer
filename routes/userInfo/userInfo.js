const express = require('express');
const router = express.Router();

const { addUser, getUserInfo, updateUserInfo, deleteUser } = require('./userInfo.controller');
const { getUserById } = require('./getUserById.controller');
const { searchUser } = require('./searchUser.controller');
router.route('/')
    .get(getUserInfo)
    .post(addUser)
    .put(updateUserInfo)
    .delete(deleteUser)

router.route('/getUserById').get(getUserById);

router.route('/searchUser').get(searchUser);

module.exports = router;    