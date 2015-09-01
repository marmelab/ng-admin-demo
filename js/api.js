var FakeRest = require('fakerest');
var sinon = require('sinon/lib/sinon/util/fake_server');

var restServer = new FakeRest.Server();
restServer.toggleLogging();
restServer.init(data);

sinon.FakeXMLHttpRequest.useFilters = true;
sinon.FakeXMLHttpRequest.addFilter(function (method, url) {
    // Do not catch webpack sync, config.js transformation but catch /upload in test env
    return url.indexOf('/socket.io/') !== -1 || url.indexOf('config.js') !== -1;
});

var server = sinon.fakeServer.create();
server.autoRespond = true;
server.autoRespondAfter = 0; // answer immediately
server.respondWith(restServer.getHandler());
