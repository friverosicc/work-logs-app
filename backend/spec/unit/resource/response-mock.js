'use strict';

module.exports = function() {
    var responseMock = {
        json: function() {},
        status: function() {}
    };

    spyOn(responseMock, 'json');
    spyOn(responseMock, 'status').and.returnValue(responseMock);

    return responseMock;
};
