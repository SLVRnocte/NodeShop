"use strict";
const deleteProduct = (btn) => {
    const productID = btn.parentNode.querySelector('[name=productID]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
    fetch(`/admin/product/${productID}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    })
        .then(result => {
        console.log(result);
    })
        .catch(err => {
        console.log(err);
    });
};
//# sourceMappingURL=admin.js.map