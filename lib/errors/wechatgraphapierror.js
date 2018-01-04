/**
 * `WechatGraphAPIError` error.
 *
 * References:
 *   - http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/oa/basic-info/return-codes#basic-info_return-codes
 *   - http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/web/login/login#login_login
 *   - http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/web/login/getting-user-profile#login_getting-user-profile
*
 * @constructor
 * @param {string} [message]
 * @param {string} [type]
 * @param {number} [code]
 * @param {number} [subcode]
 * @param {string} [traceID]
 * @access public
 */
function WechatGraphAPIError(message, type, code, subcode, traceID) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'WechatGraphAPIError';
  this.message = message;
  this.type = type;
  this.code = code;
  this.subcode = subcode;
  this.traceID = traceID;
  this.status = 500;
}

// Inherit from `Error`.
WechatGraphAPIError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = WechatGraphAPIError;
