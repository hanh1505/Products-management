

//[GET] admin/products
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system")
module.exports.index = async (req, res) => {
  // Lấy bộ lọc trạng thái
  const filterStatus = filterStatusHelper(req.query);

  let find = { deleted: false };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  // Lấy từ khóa tìm kiếm
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProducts
  );

  // end pagination
  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)
    .sort({ position: -1 }); // -1 = giảm dần, 1 = tăng dần

  res.render("admin/pages/products/index", {
    pageTitle: "Quản lý sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [GET/PATCH] admin/products/change-status/:status/:id
// SỬA: đổi trạng thái xong redirect về /admin/products (không còn res.send chuỗi nữa)
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("/admin/products");
};

// Hàm này giờ trùng logic với changeStatus, bạn có thể giữ lại hoặc xóa đi cũng được
module.exports.updateStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("/admin/products");
};

//[PATCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  // SỬA: req.bod.type -> req.body.type
  const type = req.body.type;
  const ids = req.body.ids.split(","); // "id1,id2,id3"

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "active" }
      );
      req.flash("success", `Cập nhập trạng thái thành cồng của ${ids.length} sản phẩm !!`)
      break;

    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "inactive" }
      );
      req.flash("success", `Cập nhập trạng thái thành cồng của ${ids.length} sản phẩm !!`)
      break;

    case "delete-all":
      // await Product.deleteMany({ _id: { $in: ids } }); //xóa hẳn khỏi database
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      ); //chỉ đánh dấu xóa
      req.flash("success", `Xóa thành cồng của ${ids.lengh} sản phẩm`)
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          { _id: id },
          { position: position }
        );
      }
      req.flash("success", `Cập nhập vị tri thành công của ${ids.lengh} sản phẩm`)
      break;

    default:
      break;
  }

  res.redirect("/admin/products");
};

//[DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id }); //xóa hẳn khỏi database
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  ); //chỉ đánh dấu xóa
  req.flash("success", `Xóa thành cồng sản phẩm`)
  res.redirect("/admin/products");
};

// //[GET] admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm"
  })
}
module.exports.createPost = async (req, res) => {
  // if (!req.body.title) {
  //   req.flash("error", `vui lòng nhập tiêu đề sản phẩm`)
  //   res.redirect(systemConfig.prefixAdmin + "/products/create");
  //   return;
  // }
  // if (req.body.title.length < 8) {
  //   req.flash("error", `vui lòng nhập tiêu đề sản phẩm lớn hơn 8 ký tự`)
  //   res.redirect(systemConfig.prefixAdmin + "/products/create");
  //   return;
  // }

  console.log(req.file);
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1

  } else {
    req.body.position = parseInt(req.body.position)
  }
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  const product = new Product(req.body);
  await product.save();
  res.redirect(systemConfig.prefixAdmin + "/products");
};
//[GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
  // console.log(req.params.id);
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find);
    // console.log(product);


    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product
    });
  } catch (error) {
    req.flash("error", "Sản phẩm không tồn tại hoặc đã bị xóa");
    res.redirect(systemConfig.prefixAdmin + "/products");
  }

};
//[PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {

  console.log(req.file);
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
try {
  await Product.updateOne({ _id: req.params.id }, req.body);
  req.flash("success", "Cập nhật sản phẩm thành công!");
} catch (error) {
  req.flash("error", "Cập nhật sản phẩm thất bại!");
}
  res.redirect(systemConfig.prefixAdmin + "/products");
}; 
//[GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
  // console.log(req.params.id);
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find);
    console.log(product);


    res.render("admin/pages/products/detail", {
      pageTitle: `Chi tiết sản phẩm - ${product.title}`,
      product: product
    });
  } catch (error) {
    req.flash("error", "Sản phẩm không tồn tại hoặc đã bị xóa");
    res.redirect(systemConfig.prefixAdmin + "/products");
  }

};