const { Router } = require("express");
const Image = require("../models").image;
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const allImages = await Image.findAll();
    res.json(allImages);
  } catch (e) {
    next(e);
  }
});

// router.get("/", async (req, res, next) => {
//   const limit = Math.min(req.query.limit || 25, 500);
//   const offset = req.query.offset || 0;
//   try {
//     const result = await Image.findAndCountAll({ limit, offset });
//     res.send({ images: result.rows, total: result.count });
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/", async (req, res, next) => {
  try {
    const images = await Image.create(req.body);
    res.json(images);
  } catch (error) {
    console.log(error);
    next();
  }
});

router.get("/:imgId", async (req, res) => {
  try {
    const imgId = req.params.imgId;
    const image = await Image.findByPk(imgId);
    res.json(image);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/images/auth/messy", async (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      const allImages = await Image.findAll();
      res.json(allImages);
    } catch (e) {
      res.status(400).send("Invalid JWT token");
    }
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials",
    });
  }
});

module.exports = router;
