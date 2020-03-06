import fs from 'fs';
import path from 'path';

const invoicePath = path.join(__dirname, '..', 'data', 'invoices', '/');
const imagePath = path.join(__dirname, '..', 'data', 'images', '/');

const init = () => {
  if (!fs.existsSync(invoicePath)) {
    fs.mkdirSync(invoicePath);
  }

  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath);
  }
};

export { invoicePath, imagePath, init };
