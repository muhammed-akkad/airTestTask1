const express = require('express');
const {
  createShopItem,
  getShopItems,
  getShopItem,
  updateShopItem,
  deleteShopItem
} = require('../controllers/shopItemController');

const router = express.Router();

router
  .route('/')
  .get(getShopItems)
  .post(createShopItem);

router
  .route('/:id')
  .get(getShopItem)
  .put(updateShopItem)
  .delete(deleteShopItem);

module.exports = router;