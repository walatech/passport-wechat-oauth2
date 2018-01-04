/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public

 * References:
 * - http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/web/login/getting-user-profile#login_getting-user-profile

 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.openid = json.openid;
  profile.nickname = json.nickname;
  profile.sex = json.sex;
  profile.province = json.province;
  profile.city = json.city;
  profile.country = json.country;
  profile.headimgurl = json.headimgurl;
  profile.unionid = json.unionid;
  
  return profile;
};
