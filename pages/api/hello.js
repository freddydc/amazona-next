// import db from '../../utils/database/db';
//? API route: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  // await db.connect();
  // await db.disconnect();
  res.status(200).json({ name: 'John Doe' });
}
