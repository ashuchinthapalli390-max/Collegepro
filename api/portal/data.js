/**
 * Serverless API handler for /api/portal/data
 * Provides unified GET / POST / DELETE / BATCH operations for all ET Portal modules.
 */

import { 
  getModuleRecords, 
  saveModuleRecord, 
  saveAllModuleRecords,
  deleteModuleRecord, 
  commitBatch, 
  rollbackBatch,
  readDbState 
} from '../../src/server/portalDataService.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');

  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const moduleKey = url.searchParams.get('module') || 'all';
    const action = url.searchParams.get('action') || 'get';

    if (req.method === 'GET') {
      if (moduleKey === 'all') {
        const fullState = readDbState();
        return res.status(200).json({ success: true, state: fullState });
      }
      const records = getModuleRecords(moduleKey);
      return res.status(200).json({ success: true, module: moduleKey, count: records.length, records });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      if (action === 'save-all') {
        const result = saveAllModuleRecords(moduleKey, body, req.user);
        return res.status(200).json({ success: result });
      }

      if (action === 'batch-commit') {
        const result = commitBatch(moduleKey, body, req.user);
        return res.status(200).json({ success: true, ...result });
      }

      if (action === 'rollback') {
        const { batchId } = body || {};
        const result = rollbackBatch(batchId, req.user);
        return res.status(200).json({ success: true, ...result });
      }

      const saved = saveModuleRecord(moduleKey, body, req.user);
      return res.status(200).json({ success: true, record: saved });
    }

    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing record id parameter' });
      }
      const deleted = deleteModuleRecord(moduleKey, id, req.user);
      return res.status(200).json({ success: deleted });
    }

    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  } catch (err) {
    console.error('[API_PORTAL_DATA_ERROR]', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}
