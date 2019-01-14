const api = require('./api');
const keys = require('../output_keys.json');

// HELPERS

const albumMapper = album => {
  const { name, release_date, tracks } = album;

  const mappedTracks = tracks.items.map(
    ({ track_number, name, duration_ms }) => ({
      [keys.POSITION]: track_number,
      [keys.TITLE]: name,
      [keys.DURATION]: duration_ms
    })
  );

  return {
    [keys.TITLE]: name,
    [keys.RELEASE_DATE]: release_date,
    [keys.TRACKS]: mappedTracks
  };
};

// FLOW FUNCTIONS

const getArtistId = async artist_name => {
  const response_mapper = ({ artists }) => artists.items[0].id;

  return await api.call({
    action: api.actions.SEARCH,
    payload: artist_name,
    response_mapper
  });
};

const getAlbumsIds = async artist_id => {
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

const getAlbumsDetails = async albums_ids => {
  // Connect albums ids array into one string
  const albums_ids_string = albums_ids
    .reduce((prev, next) => `${prev},${next}`, '')
    .substring(1);

  const response_mapper = ({ albums }) => albums.map(albumMapper)

  return await api.call({
    action: api.actions.ALBUM_DETAILS,
    payload: albums_ids_string,
    response_mapper
  });
};

const fetchArtistData = async artist_name => {
  const artist_id = await getArtistId(artist_name);
  const album_ids = await getAlbumsIds(artist_id);

  return await getAlbumsDetails(album_ids);
};

module.exports = { fetchArtistData };
