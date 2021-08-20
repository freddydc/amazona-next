import nc from 'next-connect';
import { isAuth } from '@utils/auth/auth';
import { onError } from '@utils/error/error';
import Order from '@models/Order/Order';
import db from '@database';

const handler = nc({ onError });
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

export default handler;
