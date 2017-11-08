var require = function (path) {
    var exports = {
        getUser: function () {
            return {id: 'test01', name: 'Jack'};
        },
        group: {id: 'group01', name: 'Friends'}
    };

    return exports;
};

var user = require('...');

function showUser() {
    return user.getUser().name + ', ' + user.group.name;
}

console.log('User Info -> ' + showUser());