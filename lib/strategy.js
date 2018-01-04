// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , uri = require('url')
  , crypto = require('crypto')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , WechatAuthorizationError = require('./errors/wechatauthorizationerror')
  , WechatTokenError = require('./errors/wechattokenerror')
  , WechatGraphAPIError = require('./errors/wechatgraphapierror');


/**
 * `Strategy` constructor.
 *
 * The Wechat authentication strategy authenticates requests by delegating to
 * Wechat using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Wechat application's App ID
 *   - `clientSecret`  your Wechat application's App Secret
 *   - `callbackURL`   URL to which Wechat will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new WechatStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/Wechat/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://open.weixin.qq.com/connect/qrconnect';
  options.tokenURL = options.tokenURL || 'https://api.weixin.qq.com/sns/oauth2/access_token';
  options.scopeSeparator = options.scopeSeparator || ',';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'wechat';
  this._profileURL = options.profileURL || 'https://api.weixin.qq.com/sns/userinfo';
  this._profileFields = options.profileFields || null;
  this._enableProof = options.enableProof;
  this._clientSecret = options.clientSecret;
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);


/**
 * Authenticate request by delegating to Wechat using OAuth 2.0.
 *
 * @param {http.IncomingMessage} req
 * @param {object} options
 * @access protected
 */
Strategy.prototype.authenticate = function(req, options) {
  // Wechat doesn't conform to the OAuth 2.0 specification, with respect to
  // redirecting with error codes.
  //
  //   FIX: https://github.com/jaredhanson/passport-oauth/issues/16
  if (req.query && req.query.error_code && !req.query.error) {
    return this.error(new WechatAuthorizationError(req.query.error_message, parseInt(req.query.error_code, 10)));
  }

  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

/**
 * Return extra Wechat-specific parameters to be included in the authorization
 * request.
 *
 * Options:
 *  - `display`  Display mode to render dialog, { `page`, `popup`, `touch` }.
 *
 * @param {object} options
 * @return {object}
 * @access protected
 */
Strategy.prototype.authorizationParams = function (options) {
  var params = {};

  // https://developers.Wechat.com/docs/reference/dialogs/oauth/
  if (options.display) {
    params.display = options.display;
  }
  
  // https://developers.Wechat.com/docs/Wechat-login/reauthentication/
  if (options.authType) {
    params.auth_type = options.authType;
  }
  if (options.authNonce) {
    params.auth_nonce = options.authNonce;
  }

  return params;
};

/**
 * Retrieve user profile from Wechat.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `Wechat`
 *   - `id`               the user's Wechat ID
 *   - `username`         the user's Wechat username
 *   - `displayName`      the user's full name
 *   - `name.familyName`  the user's last name
 *   - `name.givenName`   the user's first name
 *   - `name.middleName`  the user's middle name
 *   - `gender`           the user's gender: `male` or `female`
 *   - `profileUrl`       the URL of the profile for the user on Wechat
 *   - `emails`           the proxied or contact email address granted by the user
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var url = uri.parse(this._profileURL);
  if (this._profileFields) {
    var fields = this._convertProfileFields(this._profileFields);
    if (fields !== '') { url.search = (url.search ? url.search + '&' : '') + 'fields=' + fields; }
  }
  url = uri.format(url);

  this._oauth2.get(url, accessToken, function (err, body, res) {
    var json;
    
    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }
      
      if (json && json.error && typeof json.error == 'object') {
        return done(new WechatGraphAPIError(json.error.message, json.error.type, json.error.code, json.error.error_subcode, json.error.fbtrace_id));
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }
    
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider = 'Wechat';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

/**
 * Parse error response from Wechat OAuth 2.0 token endpoint.
 *
 * @param {string} body
 * @param {number} status
 * @return {Error}
 * @access protected
 */
Strategy.prototype.parseErrorResponse = function(body, status) {
  var json = JSON.parse(body);
  if (json.error && typeof json.error == 'object') {
    return new WechatTokenError(json.error.message, json.error.type, json.error.code, json.error.error_subcode, json.error.fbtrace_id);
  }
  return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status);
};

/**
 * Convert Wechat profile to a normalized profile.
 *
 * @param {object} profileFields
 * @return {string}
 * @access protected
 */
Strategy.prototype._convertProfileFields = function(profileFields) {
  var map = {
    'id':          'id',
    'username':    'username',
    'displayName': 'name',
    'name':       ['last_name', 'first_name', 'middle_name'],
    'gender':      'gender',
    'birthday':    'birthday',
    'profileUrl':  'link',
    'emails':      'email',
    'photos':      'picture'
  };
  
  var fields = [];
  
  profileFields.forEach(function(f) {
    // return raw Wechat profile field to support the many fields that don't
    // map cleanly to Portable Contacts
    if (typeof map[f] === 'undefined') { return fields.push(f); };

    if (Array.isArray(map[f])) {
      Array.prototype.push.apply(fields, map[f]);
    } else {
      fields.push(map[f]);
    }
  });

  return fields.join(',');
};


// Expose constructor.
module.exports = Strategy;
