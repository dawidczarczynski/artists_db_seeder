const api = require('./api');
const keys = require('../output_keys.json');

// HELPERS

const album_mapper = album => {
  const { name, release_date, tracks } = album;

  const mapped_tracks = tracks.items.map(
    ({ track_number, name, duration_ms }) => ({
      [keys.POSITION]: track_number,
      [keys.TITLE]: name,
      [keys.DURATION]: duration_ms
    })
  );

  return {
    [keys.TITLE]: name,
    [keys.RELEASE_DATE]: release_date,
    [keys.TRACKS]: mapped_tracks
  };
};

// FLOW FUNCTIONS

const get_artist_id = async artist_name => {
  const response_mapper = ({ artists }) => artists.items[0].id;

  return await api.call({
    action: api.actions.SEARCH,
    payload: artist_name,
    response_mapper
  });
};

const get_albums_ids = async artist_id => {
  // Get sorted by release date array of album ids
  const response_mapper = ({ items }) =>
    items
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      .slice(0, 3)
      .map(item => item.id);

  return await api.call({
    action: api.actions.ALBUMS_IDS,
    payload: artist_id,
    response_mapper
  });
};

const get_albums_details = async albums_ids => {
  // Connect albums ids array into one string
  const albums_ids_string = albums_ids
    .reduce((prev, next) => `${prev},${next}`, '')
    .substring(1);

  const response_mapper = ({ albums }) => albums.map(album_mapper)

  return await api.call({
    action: api.actions.ALBUM_DETAILS,
    payload: albums_ids_string,
    response_mapper
  });
};

const fetch_artist_data = async artist_name => {
  const artist_id = await get_artist_id(artist_name);
  const album_ids = await get_albums_ids(artist_id);

  return await get_albums_details(album_ids);
};

module.exports = { fetch_artist_data };
