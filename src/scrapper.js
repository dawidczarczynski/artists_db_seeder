const api = require('./api');
const utils = require('./utils');
const keys = require('../output_keys.json');

// HELPERS

const artist_mapper = artist => {
  const { id, name, genres } = artist;

  return {
    artist_id: id,
    [keys.NAME]: name,
    [keys.GENRES]: genres,
    [keys.START_YEAR]: 'TODO',
    [keys.MEMBERS]: ['TODO'],
    [keys.ORIGIN]: 'TODO'
  };
}

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
    [keys.GENRE]: 'TODO',
    [keys.MEDIUM]: 'TODO',
    [keys.TRACKS]: mapped_tracks
  };
};

// FLOW FUNCTIONS

const get_artist = async artist_name => {
  const response_mapper = ({ artists }) => artist_mapper(artists.items[0]);

  return await api.call({
    action: api.actions.SEARCH,
    payload: artist_name,
    response_mapper
  });
};

const get_albums_ids = async artist_id => {
  // Get sorted by release date array of album ids
  const response_mapper = ({ items }) => {
    const unique_albums = utils.unique_by_title(items);
    return unique_albums
      .map(item => item.id);
  };

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
  const { artist_id, ...artist_details } = await get_artist(artist_name);
  const albums_ids = await get_albums_ids(artist_id);
  const albums_details =  await get_albums_details(albums_ids);

  return {
    ...artist_details,
    [keys.ALBUMS]: albums_details
  }
};

module.exports = { fetch_artist_data };
