//middlewares/admin/uploadCloud.middleware.js
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUND_SECRET,
});
 module.exports.upload = async  (req, res, next) => {
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
  }