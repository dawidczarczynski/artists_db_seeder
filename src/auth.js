const fetch = require('node-fetch');

// Configuration
const endpoint = 'https://accounts.spotify.com/api/token';
const client_id = 'b64f5061db1646c1b3770916a87057ed';
const client_secret = 'c55edf0dbc2846d1b44090ac0c9d06ca';
const grant_type = 'client_credentials';

const parse_payload = payload => 
  Object
    .keys(payload)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`)
    .join('&');

const get_access_token = () => {
  return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: parse_payload({
        client_id,
        client_secret,
        grant_type
      })
    })
    .then(res => res.json())
    .catch(console.error);
}

module.exports = { get_access_token };
