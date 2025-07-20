const express = require('express');
const router = express.Router();
const centresController = require('../controllers/centres');

router.get('/', centresController.list);
router.post('/', centresController.create);
router.get('/:id', centresController.read);
router.put('/:id', centresController.update);
router.delete('/:id', centresController.remove);

module.exports = router; 