import { Request, Response, NextFunction } from 'express';

const get404 = (req: Request, res: Response, next: NextFunction) => {
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).render('404', { pageTitle: '404 - Not found', path: '404' });
};

export { get404 };
