// User module
const usersMap = {};

doesUserExist = function (userId) {
    return usersMap[userId] != null;
};

setupNewUser = function (author) {
    if (!doesUserExist(author.id)) {
        usersMap[author.id] = {
            name: author.username,
            commandTimestamps: {}
        }
    }
};

getUser = function (userId) {
    return usersMap[userId];
};

module.exports = {
    doesUserExist: doesUserExist,
    setupNewUser: setupNewUser,
    getUser: getUser
}