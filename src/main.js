const cli = require('./cli');
const auth = require('./auth');
const api = require('./api');
const scrapper = require('./scrapper');
const file = require('./file');

const prompts = Object.freeze({
  ARTIST: 'Enter artist name: ',
  FETCHING: 'Fetching artist data...'
});

(async function() {
  // Get Spotify API auth token
  api.set_access_token(
    await auth.get_access_token()
  );

  // Input artist name
  const artist_name = await cli.question(prompts.ARTIST);

  // Fetch artist data
  console.log(prompts.FETCHING);
  const artist_data = await scrapper.fetch_artist_data(artist_name);

  // Save results to file
  const saving_result = await file.save_output(
    artist_data,
    artist_name
  );
  console.log(saving_result);

  process.exit(0);
})();
