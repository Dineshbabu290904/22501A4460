import Url from '../models/url.model.js';
import { nanoid } from 'nanoid';
import geoip from 'geoip-lite';
const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
};

export const createShortUrl = async (req, res, next) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || !isValidUrl(url)) {
      req.log('warn', 'Invalid URL format provided', { url });
      return res.status(400).json({ error: 'A valid URL must be provided.' });
    }

    let code = shortcode;

    if (code) {
      if (!/^[a-zA-Z0-9_-]{4,10}$/.test(code)) {
        req.log('warn', 'Invalid custom shortcode format', { shortcode: code });
        return res.status(400).json({ error: 'Custom shortcode must be 4-10 alphanumeric characters.' });
      }
      const existing = await Url.findOne({ shortcode: code });
      if (existing) {
        req.log('warn', 'Custom shortcode already in use', { shortcode: code });
        return res.status(409).json({ error: 'This shortcode is already in use.' });
      }
    } else {
      do {
        code = nanoid(7);
      } while (await Url.findOne({ shortcode: code }));
    }

    const validityMinutes = validity || 30; 
    const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);

    const newUrl = new Url({
      longUrl: url,
      shortcode: code,
      expiresAt: expiresAt,
    });

    await newUrl.save();
    req.log('info', 'Successfully created short URL', { shortcode: code, originalUrl: url });

    res.status(201).json({
      shortLink: `${process.env.BASE_URL}/${code}`,
      expiry: expiresAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

export const redirectToLongUrl = async (req, res, next) => {
  try {
    const { shortcode } = req.params;
    const urlEntry = await Url.findOne({ shortcode });

    if (!urlEntry) {
      req.log('warn', 'Shortcode not found', { shortcode });
      return res.status(404).json({ error: 'Shortcode not found.' });
    }

    if (new Date() > urlEntry.expiresAt) {
      req.log('info', 'Attempted to access expired link', { shortcode });
      return res.status(410).json({ error: 'This link has expired.' });
    }

    const ip = req.ip;
    const geo = geoip.lookup(ip);
    
    urlEntry.clickCount++;
    urlEntry.clickDetails.push({
      ipAddress: ip,
      referrer: req.get('Referrer') || 'Direct',
      location: geo ? `${geo.city}, ${geo.country}` : 'Unknown',
    });
    
    await urlEntry.save();
    
    req.log('info', 'Redirecting short URL', { shortcode, target: urlEntry.longUrl });
    return res.redirect(302, urlEntry.longUrl);

  } catch (error) {
    next(error);
  }
};

export const getUrlStats = async (req, res, next) => {
    try {
        const { shortcode } = req.params;
        const urlEntry = await Url.findOne({ shortcode });

        if (!urlEntry) {
            req.log('warn', 'Statistics requested for non-existent shortcode', { shortcode });
            return res.status(404).json({ error: 'Statistics not found for this shortcode.' });
        }
        
        req.log('info', 'Fetched statistics for shortcode', { shortcode });

        res.status(200).json({
            originalUrl: urlEntry.longUrl,
            createdAt: urlEntry.createdAt.toISOString(),
            expiresAt: urlEntry.expiresAt.toISOString(),
            totalClicks: urlEntry.clickCount,
            clickDetails: urlEntry.clickDetails,
        });

    } catch (error) {
        next(error);
    }
};

export const getAllUrls = async (req, res, next) => {
    try {
        const allUrls = await Url.find({}).sort({ createdAt: -1 });
        req.log('info', 'Fetched all URL entries');
        res.status(200).json(allUrls);
    } catch (error) {
        next(error);
    }
};