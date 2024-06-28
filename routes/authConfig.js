/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config({ path: '.env.dev' });

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID_Microsoft, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: 'https://login.microsoftonline.com/common', // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
        clientSecret: process.env.CLIENTSECRET_ID_Microsoft // Client secret generated from the app registration in Azure portal
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
}

const REDIRECT_URI = 'http://localhost:4400/auth/microsoft/callback';
const POST_LOGOUT_REDIRECT_URI = 'localhost:4400/auth/logout';
const GRAPH_ME_ENDPOINT ='https://graph.microsoft.com/v1.0/me';

module.exports = {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
    GRAPH_ME_ENDPOINT
};