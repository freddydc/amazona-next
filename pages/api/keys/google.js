import nc from 'next-connect';
import { isAuth } from '@utils/auth/auth';

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || 'no_key');
});

export default handler;
