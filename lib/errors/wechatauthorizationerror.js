/**
 * `WechatAuthorizationError` error.
 *
 * WechatAuthorizationError represents an error in response to an
 * authorization request on Wechat.  Note that these responses don't conform
 * to the OAuth 2.0 specification.
 *
 * References:
 *   - http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/oa/basic-info/return-codes#basic-info_return-codes
 *   - http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/web/login/login#login_login
 *   - http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/web/login/getting-user-profile#login_getting-user-profile
 *
 * @constructor
 * @param {string} [message]
 * @param {number} [code]
 * @access public
 */
function WechatAuthorizationError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'WechatAuthorizationError';
  this.message = message;
  this.code = code;
  this.status = 500;
}

// Inherit from `Error`.
WechatAuthorizationError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = WechatAuthorizationError;
