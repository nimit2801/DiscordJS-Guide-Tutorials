const fetch = require('node-fetch');
const express = require('express');
const { clientID, clientSecret, port } = require('./config.json');

const app = express();

app.get('/', async ({ query }, response) => {
  const { code } = query;

  if (code) {
    try {
      const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: clientID,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `http://localhost:${port}`,
          scope: ['identify', 'connection'],
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const oauthData = await oauthResult.json();

      const userResult = await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });

      console.log(await userResult.json());
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error;
      // it will return a 401 Unauthorized response in the try block above
      console.error(error);
    }
  }

  return response.sendFile('index.html', { root: '.' });
});

app.get('/connection', async ({ query }, response) => {
  const { code } = query;

  if (code) {
    try {
      const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: clientID,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `http://localhost:${port}/connection`,
          scope: ['connection'],
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const oauthData = await oauthResult.json();

      const userResult = await fetch(
        'https://discord.com/api/users/@me/connections',
        {
          headers: {
            authorization: `${oauthData.token_type} ${oauthData.access_token}`,
          },
        }
      );
      console.log('here');
      console.log('response: ' + (await userResult.json()));
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error;
      // it will return a 401 Unauthorized response in the try block above
      console.error(error);
    }
  }

  return response.sendFile('index_c.html', { root: '.' });
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
