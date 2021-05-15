const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { get_shares, get_one_share, post_share, add_balance, get_balance, buy, sell } = require('../controllers/tradeControllers');

const router = Router();

router.get('/shares', requireAuth ,get_shares);
router.get('/share/:symbol?', requireAuth, get_one_share);
router.post('/register-share', requireAuth, post_share);
router.get('/balance', requireAuth, get_balance);
router.post('/balance', requireAuth, add_balance);
router.post('/buy', requireAuth, buy);
router.post('/sell', requireAuth, sell);

module.exports = router;