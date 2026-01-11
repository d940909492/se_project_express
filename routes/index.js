const router = require("express").Router();

const usersRouter = require("./users");
const itemsRouter = require("./clothingItems");

router.use("/users", usersRouter);
router.use("/items", itemsRouter);

router.use((req, res) => {
  res.status(404).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
