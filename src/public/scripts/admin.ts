const deleteProduct = (btn: HTMLElement) => {
  const productID = (btn.parentNode!.querySelector(
    '[name=productID]'
  )! as HTMLInputElement).value;
  const csrfToken = (btn.parentNode!.querySelector(
    '[name=_csrf]'
  )! as HTMLInputElement).value;
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
      productElement!.parentNode?.removeChild(productElement!);
    })
    .catch(err => {
      console.log(err);
    });
};
