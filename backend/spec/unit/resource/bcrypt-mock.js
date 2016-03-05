'use strict';

module.exports = function() {
    var bcryptMock = require('bcrypt');

    spyOn(bcryptMock, 'hashSync').and.callFake(function(password) {
        return 'passwordEncrypted';
    });

    spyOn(bcryptMock, 'compareSync').and.callFake(function(pass1, pass2) {
        if(pass1 === pass2)
            return true;
        return false;
    });

    return bcryptMock;
};
