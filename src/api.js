const fetch = require('node-fetch');

// Constants
const actions = Object.freeze({
  SEARCH: 'SEARCH',
  ALBUMS_IDS: 'ALBUMS_IDS',
  ALBUM_DETAILS: 'ALBUM_DETAILS'
});

const endpoints = Object.freeze({
  [actions.SEARCH]: name => `search?q=${name}&type=artist`,
  [actions.ALBUMS_IDS]: id => `artists/${id}/albums`,
  [actions.ALBUM_DETAILS]: ids => `albums?ids=${ids}`
});

// Auth state
const auth = {
  access_token: '',
  token_type: ''
};

const set_access_token = ({ access_token, token_type }) => {
  auth.access_token = access_token;
  auth.token_type = token_type;
};

// Http Client
const handle_http_errors = response => {
  if (response.error) {
    throw Error(response.error.message);
  } 
  return response;
};

const call = ({ action, payload, response_mapper }) => {
  const { access_token, token_type } = auth;
  const endpoint = endpoints[action](payload);
  const api_url = `https://api.spotify.com/v1/${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `${token_type} ${access_token}`
  };

  return fetch(api_url, { method: 'GET', headers })
    .then(res => res.json())
    .then(handle_http_errors)
    .then(response_mapper)
    .catch(console.error);
}

module.exports = { actions, call, set_access_token };
