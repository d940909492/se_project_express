const Item = require("../models/clothingItem");
const { SERVER_ERROR, NOT_FOUND, BAD_REQUEST } = require("../utils/errors");

module.exports.getItems = (req, res) => {
  Item.find({})
    .populate("owner")
    .then((items) =>
      res.send({
        message: "get all items called",
        data: items,
      })
    )
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;

  Item.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) =>
      res.status(201).send({
        message: "create item called",
        data: item,
      })
    )
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.deleteItem = (req, res) => {
  Item.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "item not found" });
      }

      return Item.findByIdAndDelete(req.params.itemId)
        .onFail()
        .then(() =>
          res.send({
            message: "delete item called",
            data: item,
          })
        );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "user id is invalid" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "user not found" });
      }
      return res.status(SERVER_ERROR).send({ message: "server error" });
    });
};

module.exports.updatelikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .populate("owner likes")
    .onFail()
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "item not found" });
      }

      return res.send({
        message: "item liked",
        data: item,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "user id is invalid" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "user not found" });
      }
      return res.status(SERVER_ERROR).send({ message: "server error" });
    });
};

module.exports.deletelikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .populate("owner likes")
    .onFail()
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "item not found" });
      }

      return res.send({
        message: "item unliked",
        data: item,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "user id is invalid" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "user not found" });
      }
      return res.status(SERVER_ERROR).send({ message: "server error" });
    });
};
