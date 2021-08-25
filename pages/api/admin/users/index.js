import nc from 'next-connect';
import { isAuth, isAdmin } from '@utils/auth/auth';
import User from '@models/User/User';
import db from '@database';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});

export default handler;
