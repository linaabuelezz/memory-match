import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, attempts } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      let user;
      if (existingUser) {
        if (attempts < existingUser.attempts) {
          user = await prisma.user.update({
            where: { email },
            data: { attempts }
          });
        } else {
          user = existingUser;
        }
      } else {
        user = await prisma.user.create({
          data: { name, email, attempts }
        });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
