import FakeRest from 'fakerest';

import {
    fakeServer,
    FakeXMLHttpRequest,
    useFakeXMLHttpRequest
} from 'sinon';


var restServer = new FakeRest.Server();
restServer.toggleLogging();
restServer.init(require('./data.js'));

FakeXMLHttpRequest.useFilters = true;
FakeXMLHttpRequest.addFilter(function (method, url) {
    // Do not catch webpack sync, config.js transformation but catch /upload in test env
    return url.indexOf('/socket.io/') !== -1 || url.indexOf('config.js') !== -1;
});
useFakeXMLHttpRequest();

var server = fakeServer.create();
fakeServer.autoRespond = true;
fakeServer.autoRespondAfter = 0; // answer immediately
fakeServer.respondWith(restServer.getHandler());
