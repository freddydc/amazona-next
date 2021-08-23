import nc from 'next-connect';
import { onError } from '@utils/error/error';
import { isAdmin, isAuth } from '@utils/auth/auth';
import Product from '@models/Product/Product';
import db from '@database';

const handler = nc({ onError });
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

export default handler;
