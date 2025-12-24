const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const router = express.Router();

cloudinary.config({
  cloud_name: "dy0ejkx4g",
  api_key: "267579526251791",
  api_secret: "hxFZQF6j65OlE3rfsU3Aw6eqnoQ",
});

const upload = multer();

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  async function (req, res, next) {
    if (req.file) {
      try {
        let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream((error, result) => {
              if (result) resolve(result);
              else reject(error);
            });

            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };

        let result = await streamUpload(req);
        // ✅ dùng https
        req.body[req.file.fieldname] = result.secure_url;

        next();
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
  },
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;
