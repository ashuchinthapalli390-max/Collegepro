import { MEDIA_ASSETS } from '../../data/mediaAssets.js';

/**
 * Media Health Validator
 * Verifies that all registered media assets have valid paths, posters, and metadata.
 */
export function checkMediaHealth() {
  const report = {
    total: MEDIA_ASSETS.length,
    images: 0,
    videos: 0,
    healthy: 0,
    issues: []
  };

  MEDIA_ASSETS.forEach(asset => {
    if (asset.mediaType === 'IMAGE') {
      report.images++;
    } else if (asset.mediaType === 'VIDEO') {
      report.videos++;
    }

    // Check basic metadata
    if (!asset.title || !asset.category) {
      report.issues.push({ id: asset.id, type: 'MISSING_METADATA', details: 'Missing title or category' });
      return;
    }

    if (!asset.storagePath && !asset.publicUrl) {
      report.issues.push({ id: asset.id, type: 'MISSING_PATH', details: 'No path defined' });
      return;
    }

    if (asset.mediaType === 'VIDEO' && !asset.posterUrl) {
      report.issues.push({ id: asset.id, type: 'MISSING_POSTER', details: 'Video has no poster image mapped' });
    }

    report.healthy++;
  });

  return report;
}
