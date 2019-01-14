const cli = require('./cli');
const auth = require('./auth');
const api = require('./api');
const scrapper = require('./scrapper');
const file = require('./file');

const prompts = Object.freeze({
  EMAIL: 'Enter your email: ',
  PASSWORD: 'Enter your password: ',
  ARTIST: 'Enter artist name: '
});

(async function() {
  api.set_access_token(
    await auth.get_access_token()
  );

  const artist_name = await cli.question(prompts.ARTIST);
  const artist_data = await scrapper.fetchArtistData(artist_name);

  await file.saveOutput(
    artist_data,
    artist_name
  );
})();
