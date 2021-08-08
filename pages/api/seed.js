import nc from 'next-connect';
import Product from '@models/product/Product';
import db from '@database';
import data from '@data';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: 'Seeded successfully' });
});

export default handler;
