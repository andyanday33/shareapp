const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { get_shares, get_one_share, add_balance, get_balance, buy, sell, get_transaction_logs, register_portfolio } = require('../controllers/tradeControllers');

const router = Router();

router.get('/api/v1/shares', requireAuth ,get_shares);
router.get('/api/v1/share/:symbol?', requireAuth, get_one_share);
router.get('/api/v1/balance', requireAuth, get_balance);
router.put('/api/v1/balance', requireAuth, add_balance);
router.post('/api/v1/buy', requireAuth, buy);
router.post('/api/v1/sell', requireAuth, sell);
router.get('/api/v1/trade-history', requireAuth, get_transaction_logs);
router.post('/api/v1/register-portfolio', requireAuth, register_portfolio);

module.exports = router;