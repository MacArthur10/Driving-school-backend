const express = require('express');
const router = express.Router();
const adminsController = require('../controllers/admins');

router.get('/', adminsController.list);
router.post('/', adminsController.create);
router.get('/:id', adminsController.read);
router.put('/:id', adminsController.update);
router.delete('/:id', adminsController.remove);

module.exports = router; 