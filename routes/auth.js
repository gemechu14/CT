/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');

const authProvider = require('./AuthProvider.js');
const { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require('./authConfig.js');

const router = express.Router();

router.get('/signin', authProvider.login({
    scopes: [],
    redirectUri:  'http://localhost:4400/auth1/redirect',
    successRedirect: '/'
}));

router.get('/acquireToken', authProvider.acquireToken({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
    successRedirect: '/users/profile'
}));

router.get('/redirect', authProvider.handleRedirect());

router.get('/signout', authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI
}));

module.exports = router;