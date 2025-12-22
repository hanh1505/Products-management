//button status filter
const buttonStatus = document.querySelectorAll('[button-status]');
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('button-status');
            // console.log('Filter products by status:', status);
            if (status) {
                url.searchParams.set('status', status);
            } else {
                url.searchParams.delete('status');
            }
            // console.log(url.href);
            window.location.href = url.href;
        });
    });
}
//form search
const formSearch = document.querySelector('#form-search');
if (formSearch) {
    formSearch.addEventListener('submit', (e) => {
        let url = new URL(window.location.href);
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        // console.log('Search products by keyword:', keyword);
        if (keyword) {
            url.searchParams.set('keyword', keyword);
        } else {
            url.searchParams.delete('keyword');
        }
        window.location.href = url.href;
    });
}
//end form search
//pagination
const buttonsPagination = document.querySelectorAll('[button-pagination]');
// console.log(buttonPagination);
if (buttonsPagination) {
    buttonsPagination.forEach(button => {
        let url = new URL(window.location.href);
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            // console.log('Go to page:', page);
            url.searchParams.set('page', page);
            window.location.href = url.href;
        });
    });
}
//end pagination
//checkbox select all
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click", () => {
        console.log(inputCheckAll.checked);
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })
}
//end checkbox select all
//form change multi

const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelectorAll("[checkbox-multi]");
        const inputsChecked = document.querySelectorAll(
            "[checkbox-multi] input[name='id']:checked"
        );

        const typeChange = e.target.elements.type.value;
        if (typeChange == 'delete-all') {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không?");
            if (!isConfirm) {
                return;
            }
        }
        console.log('Type change:', typeChange);
        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    
                    console.log(`${id}-${position}`);
                    ids.push(`${id}-${position}`)
                } else {
                    ids.push(id);
                }
            });

            inputIds.value = ids.join(",");
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi!");
        }
    });
}
//end form change multi
// show-alert
const showAlert = document.querySelector("[show-alert]")
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"))  
    const closeAlert = showAlert.querySelector("[close-alert]")
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time);
    closeAlert.addEventListener("click",() => {
        showAlert.classList.add("alert-hidden")
    })
}

//End show alert