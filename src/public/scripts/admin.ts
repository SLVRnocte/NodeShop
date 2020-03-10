const deleteProduct = (btn: HTMLElement) => {
  const productID = (btn.parentNode!.querySelector(
    '[name=productID]'
  )! as HTMLInputElement).value;
  const csrfToken = (btn.parentNode!.querySelector(
    '[name=_csrf]'
  )! as HTMLInputElement).value;

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
