"use strict";
const deleteProduct = (btn) => {
    const productID = btn.parentNode.querySelector('[name=productID]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');
    fetch(`/admin/product/${productID}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    })
        .then(result => {
        return result.json();
    })
        .then(data => {
        var _a;
        (_a = productElement.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(productElement);
    })
        .catch(err => {
        console.log(err);
    });
};
//# sourceMappingURL=admin.js.map