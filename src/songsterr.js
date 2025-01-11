import { scraper } from './scraper.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { pipeline } from 'stream';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const streamPipeline = promisify(pipeline);

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

export async function downloadTabFile(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch the file');
    }

    const filePath = path.join(process.cwd(), 'tabs', filename);
    const fileStream = fs.createWriteStream(filePath);

    await streamPipeline(response.body, fileStream);

    console.log('Download complete:', filePath);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}
