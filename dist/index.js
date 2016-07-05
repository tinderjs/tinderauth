'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _zombie = require('zombie');

var _zombie2 = _interopRequireDefault(_zombie);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_zombie2.default.waitDuration = '30s';

var FACEBOOK_PROFILE = 'http://www.facebook.com/';
var FACEBOOK_AUTHENTICATION_TOKEN_URL = 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token';

exports.default = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(email, password) {
    var token, browser, _ref, profile_id;

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
            token = void 0;
            browser = new _zombie2.default();


            browser.on('loaded', function () {
              var t = browser.url.match(/#access_token=(.+)&/);

              if (t && t[1]) {
                token = t[1];
              }
            });

            _context.next = 9;
            return browser.visit(FACEBOOK_AUTHENTICATION_TOKEN_URL);

          case 9:
            browser.fill('#email', email).fill('#pass', password);
            _context.next = 12;
            return browser.pressButton('#loginbutton');

          case 12:
            _context.next = 14;
            return browser.visit(FACEBOOK_PROFILE);

          case 14:
            _context.next = 16;
            return _axios2.default.get('https://graph.facebook.com/me?access_token=' + token);

          case 16:
            _ref = _context.sent;
            profile_id = _ref.data.id;
            return _context.abrupt('return', { token: token, profile_id: profile_id });

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function getTokenAndId(_x, _x2) {
    return ref.apply(this, arguments);
  }

  return getTokenAndId;
}();