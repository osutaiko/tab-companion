import { scraper } from './scraper.js';

export async function getSearchResultFromSongsterrUrl(songsterrUrl) {
  const doc = await scraper.getDocumentFromUrl(songsterrUrl, 'html');
  if (!doc) {
    throw new Error('Unable to get page data from Songsterr');
  }

  const { songId, title, artist, source, artistId } = getMetadataFromDoc(doc);

  return {
    songId,
    artistId,
    title,
    artist,
    source,
  };
}

function getMetadataFromDoc(doc) {
  try {
    const metadataScript = doc.getElementById('state')?.childNodes[0].nodeValue;
    return JSON.parse(metadataScript).meta.current;
  } catch (error) {
    throw new Error('Error reading tab data');
  }
}

export async function getDownloadLinkFromSongId(songId) {
  const url = urlBuilder.bySongId(songId);
  try {
    const xml = await scraper.getDocumentFromUrl(url, 'xml');
    return findGuitarProTabLinkFromXml(xml) || '';
  } catch (error) {
    throw new Error('Error fetching download link');
  }
}

function findGuitarProTabLinkFromXml(xml) {
  return xml
    .getElementsByTagName('guitarProTab')[0]
    .getElementsByTagName('attachmentUrl')[0].firstChild?.nodeValue;
}

const urlBuilder = {
  bySongId(songId) {
    return `https://www.songsterr.com/a/ra/player/song/${songId}.xml`;
  },
};
