import { Router } from 'express';
import { createShortUrl, getUrlStats, getAllUrls, redirectToLongUrl } from '../controllers/url.controller.js';

const router = Router();

// API routes are grouped
const apiRouter = Router();
apiRouter.post('/shorturls', createShortUrl);
apiRouter.get('/shorturls', getAllUrls); // For the stats page
apiRouter.get('/shorturls/:shortcode', getUrlStats);

// Main router uses the API router under a /api prefix
router.use('/api', apiRouter);

// The redirection route is at the root level
router.get('/:shortcode', redirectToLongUrl);

export default router;