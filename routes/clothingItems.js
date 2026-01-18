const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  getItems,
  createItem,
  deleteItem,
  updatelikeItem,
  deletelikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, updatelikeItem);
router.delete("/:itemId/likes", auth, deletelikeItem);

module.exports = router;
