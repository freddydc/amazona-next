import nc from 'next-connect';
import Product from '@models/Product/Product';
import User from '@models/User/User';
import db from '@database';
import data from '@data';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: 'Seeded successfully' });
});

export default handler;
