const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth').router);
router.use('/user', require('./user'));
router.use('/foodtype', require('./foodtype'));
router.use('/food', require('./food'));
router.use('/order', require('./order'));
router.use('/customer', require('./customer'));
router.use('/ingredient', require('./ingredient'));
router.use('/ingtype', require('./ingtype'));
router.use('/change', require('./change'));
router.use('/param', require('./param'));

module.exports = router;