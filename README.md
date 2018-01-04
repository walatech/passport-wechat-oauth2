# passport-wechat-oauth2

[![Build](https://img.shields.io/travis/jaredhanson/passport-WeChat.svg)](https://travis-ci.org/jaredhanson/passport-WeChat)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/passport-WeChat.svg)](https://coveralls.io/r/jaredhanson/passport-WeChat)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/passport-WeChat.svg?label=quality)](https://codeclimate.com/github/jaredhanson/passport-WeChat)
[![Dependencies](https://img.shields.io/david/jaredhanson/passport-WeChat.svg)](https://david-dm.org/jaredhanson/passport-WeChat)


[Passport](http://passportjs.org/) strategy for authenticating with [WeChat](http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/web/login/login)
using the OAuth 2.0 API.

This module lets you authenticate using WeChat in your Node.js applications.
By plugging into Passport, WeChat authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-wechat-oauth2

## Usage

#### Create an Application

Before using `passport-wechat-oauth2`, you must register an application with
WeChat.  If you have not already done so, a new application can be created at
[WeChat Developers](http://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/faq&symbol=faqs-oa-registration).  Your application will
be issued an app ID and app secret, which need to be provided to the strategy.
You will also need to configure a redirect URI which matches the route in your
application.

#### Configure Strategy

The WeChat authentication strategy authenticates users using a WeChat
account and OAuth 2.0 tokens.  The app ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
WeChat profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
passport.use(new WeChatStrategy({
    clientID: WeChat_APP_ID,
    clientSecret: WeChat_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/WeChat/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ WeChatId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'WeChat'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/WeChat',
  passport.authenticate('WeChat'));

app.get('/auth/WeChat/callback',
  passport.authenticate('WeChat', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-WeChat-example)
as a starting point for their own web applications.

```

## Support

#### Funding

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is dedicated by [@jaredhanson](https://github.com/jaredhanson).
If you (or your employer) benefit from this project, please consider a financial
contribution.  Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [PayPal](https://paypal.me/jaredhanson), [Venmo](https://venmo.com/jaredhanson),
and [other](http://jaredhanson.net/pay) methods.  Any amount is appreciated.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>


