import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    try {
      const user = await prisma.user.create({
        data: { name, email },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "User creation failed" });
    }
  } else if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();
      console.log(users);
      res.status(200).json(users);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: "Fetching users failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
