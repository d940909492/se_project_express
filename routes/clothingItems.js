const router = require("express").Router();

const {
  getItems,
  createItem,
  deleteItem,
  updatelikeItem,
  deletelikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", updatelikeItem);
router.delete("/:itemId/likes", deletelikeItem);

module.exports = router;
