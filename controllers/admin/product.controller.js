//[GET] admin/products
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
module.exports.index = async (req, res) => {
  // console.log(req.query.status);
  // Lấy bộ lọc trạng thái
  const filterStatus = filterStatusHelper(req.query);
  // console.log(filterStatus);
  let find = { deleted: false };
  if (req.query.status) {
    find.status = req.query.status;
  }
  const objectSearch = searchHelper(req.query);
  // console.log(objectSearch);
  // Lấy từ khóa tìm kiếm
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProducts
  );

  // if (req.query.page) {
  //   objectPagination.currentPage = parseInt(req.query.page);
  // }
  // objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
  // const countProducts = await Product.countDocuments(find);
  // // console.log(countProducts);
  // const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
  // // console.log(totalPage);
  // objectPagination.totalPage = totalPage;

  //end pagination
  const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

  // console.log(products);
  res.render("admin/pages/products/index", {
    pageTitle: "Quản lý sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
}
//[GET] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;
  res.send(`${id} - ${status}`);
}
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  res.redirect("/admin/products");
}
//[PATCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", "); // "id1,id2,id3"
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      break;
    case "delete-all":
      // await Product.deleteMany({ _id: { $in: ids } }); //xóa hẳn khỏi database
      await Product.updateMany({ _id: { $in: ids } }, { 
        deleted: true,
        deletedAt: new Date(),
       }); //chỉ đánh dấu xóa             
      break;
    default:
      break;
  }
  res.redirect("/admin/products");
}
//[DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id }); //xóa hẳn khỏi database
  await Product.updateOne({ _id: id }, { 
    deleted: true,
    deletedAt: new Date(),
   }); //chỉ đánh dấu xóa             
  res.redirect("/admin/products");
}
