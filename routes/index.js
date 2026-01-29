const router = require("express").Router();

const usersRouter = require("./users");
const itemsRouter = require("./clothingItems");
const { login, createUser, logout } = require("../controllers/users");
const { validateUserBody, validateLogin } = require("../middleware/validation");

router.use("/users", usersRouter);
router.use("/items", itemsRouter);

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);

router.post("/signout", logout);

router.use((req, res) => {
  res.status(404).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
