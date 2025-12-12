module.exports = (objectPagination, query,countProducts) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
    // console.log(countProducts);
    const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
    // console.log(totalPage);
    objectPagination.totalPage = totalPage;
    return objectPagination;
}