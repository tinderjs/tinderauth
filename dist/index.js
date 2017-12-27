'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _zombie = require('zombie');

var _zombie2 = _interopRequireDefault(_zombie);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _nock = require('nock');

var _nock2 = _interopRequireDefault(_nock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_zombie2.default.waitDuration = '60s';
var debug = require('debug')('tinderauth');

var FACEBOOK_AUTHENTICATION_TOKEN_URL = 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=fb464891386855067://authorize/&&scope=user_birthday,user_photos,user_education_history,email,user_relationship_details,user_friends,user_work_history,user_likes&response_type=token';

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(email, password) {
    var browser, nockCallObjects, urlRegex, tokenResponse, _tokenResponse$0$resp, _tokenResponse$0$resp2, token, _ref2, profile_id, ret;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = email || process.env.FACEBOOK_EMAIL;
            password = password || process.env.FACEBOOK_PASSWORD;

            if (!(!email || !password)) {
              _context.next = 4;
              break;
            }

            throw new Error('Define username and password via env vars');

          case 4:
            browser = new _zombie2.default();
            _context.next = 7;
            return browser.visit(FACEBOOK_AUTHENTICATION_TOKEN_URL);

          case 7:
            browser.fill('#email', email).fill('#pass', password);
            _context.prev = 8;
            _context.next = 11;
            return browser.pressButton('#loginbutton');

          case 11:
            _context.next = 18;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context['catch'](8);

            debug('#loginbutton not found trying input[name=login]');
            _context.next = 18;
            return browser.pressButton("input[name='login']");

          case 18:

            debug('passed login');
            _nock2.default.recorder.rec({ output_objects: true, dont_print: true });
            _context.prev = 20;
            _context.next = 23;
            return browser.pressButton("button[name='__CONFIRM__']");

          case 23:
            _context.next = 44;
            break;

          case 25:
            _context.prev = 25;
            _context.t1 = _context['catch'](20);

            if (!(_context.t1.message === "Cannot read property 'birthdate' of null")) {
              _context.next = 41;
              break;
            }

            debug('got error ' + _context.t1.message + ' but ignoring');
            _context.prev = 29;
            _context.next = 32;
            return browser.wait();

          case 32:
            _context.next = 39;
            break;

          case 34:
            _context.prev = 34;
            _context.t2 = _context['catch'](29);

            _nock2.default.recorder.restore();
            _nock2.default.recorder.clear();
            throw _context.t2;

          case 39:
            _context.next = 44;
            break;

          case 41:
            _nock2.default.recorder.restore();
            _nock2.default.recorder.clear();
            throw _context.t1;

          case 44:
            nockCallObjects = _nock2.default.recorder.play();
            urlRegex = /\/v[0-9]\.[0-9]\/dialog\/oauth\/(confirm|read)\?dpr=[0-9]{1}/;
            tokenResponse = _underscore2.default.filter(nockCallObjects, function (nockCallObject) {
              return urlRegex.test(nockCallObject.path);
            });


            _nock2.default.recorder.restore();
            _nock2.default.recorder.clear();

            if (!(tokenResponse.length !== 1)) {
              _context.next = 51;
              break;
            }

            throw new Error('Tinderauth tokenresponse not found! length: ' + tokenResponse.length);

          case 51:
            debug(tokenResponse[0].response);

            _tokenResponse$0$resp = tokenResponse[0].response.match(/#access_token=(.+)&/), _tokenResponse$0$resp2 = (0, _slicedToArray3.default)(_tokenResponse$0$resp, 2), token = _tokenResponse$0$resp2[1];
            _context.next = 55;
            return _axios2.default.get('https://graph.facebook.com/me?access_token=' + token);

          case 55:
            _ref2 = _context.sent;
            profile_id = _ref2.data.id;
            ret = { token: token, profile_id: profile_id };

            debug(ret);
            return _context.abrupt('return', ret);

          case 60:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[8, 13], [20, 25], [29, 34]]);
  }));

  function getTokenAndId(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return getTokenAndId;
}();

module.exports = exports['default'];