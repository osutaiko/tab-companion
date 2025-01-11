import { JSDOM } from 'jsdom';

const fetch = (await import('node-fetch')).default;

async function getDocumentFromUrl(url, type) {
  const response = await fetch(url);
  const text = await response.text();

  if (type === 'html') {
    return new JSDOM(text).window.document;
  }

  if (type === 'xml') {
    return new JSDOM(text, { contentType: 'application/xml' }).window.document;
  }

  throw new Error(`Unsupported type: ${type}`);
}

export const scraper = { getDocumentFromUrl };
