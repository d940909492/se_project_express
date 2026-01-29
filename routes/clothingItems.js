const router = require("express").Router();
const auth = require("../middleware/auth");
const { validateCardBody, validateId } = require("../middleware/validation");

const {
  getItems,
  createItem,
  deleteItem,
  updatelikeItem,
  deletelikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", auth, validateCardBody, createItem);

router.delete("/:itemId", auth, validateId, deleteItem);
router.put("/:itemId/likes", auth, validateId, updatelikeItem);
router.delete("/:itemId/likes", auth, validateId, deletelikeItem);

module.exports = router;
