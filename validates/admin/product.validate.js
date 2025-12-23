module.exports.createPost = async (req, res, next) => {
      if(!req.body.title){
        req.flash("error", `vui lòng nhập tiêu đề sản phẩm`)
        res.redirect(systemConfig.prefixAdmin + "/products/create");
        return;
      }
      next();
}