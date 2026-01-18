const Item = require("../models/clothingItem");
const {
  SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  FORBIDDEN,
} = require("../utils/errors");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) =>
      res.send({
        data: items,
      })
    )
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  Item.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) =>
      res.status(201).send({
        data: item,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: err.message,
        });
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.deleteItem = (req, res) => {
  Item.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "item not found" });
      }
      if (item.owner.toString() !== req.user._id) {
        return res.status(FORBIDDEN).send({ message: "This is not your item" });
      }

      return Item.findByIdAndDelete(req.params.itemId).then(() =>
        res.send({
          message: "delete item called",
          data: item,
        })
      );
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "item id is invalid" });
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
    .orFail()
    .then((item) =>
      res.send({
        data: item,
      })
    )
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "item id is invalid" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "item not found" });
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
    .orFail()
    .then((item) =>
      res.send({
        data: item,
      })
    )
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "item id is invalid" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "item not found" });
      }
      return res.status(SERVER_ERROR).send({ message: "server error" });
    });
};
