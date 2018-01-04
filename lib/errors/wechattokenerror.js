/**
 * `WechatTokenError` error.
 *
 * WechatTokenError represents an error received from a Wechat's token
 * endpoint.  Note that these responses don't conform to the OAuth 2.0
 * specification.
 *
 * References:
 *   - http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/oa/basic-info/return-codes#basic-info_return-codes
 *
 * @constructor
 * @param {string} [message]
 * @param {string} [type]
 * @param {number} [code]
 * @param {number} [subcode]
 * @param {string} [traceID]
 * @access public
 */
function WechatTokenError(message, type, code, subcode, traceID) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'WechatTokenError';
  this.message = message;
  this.type = type;
  this.code = code;
  this.subcode = subcode;
  this.traceID = traceID;
  this.status = 500;
}

// Inherit from `Error`.
WechatTokenError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = WechatTokenError;
