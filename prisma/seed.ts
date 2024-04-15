import { PrismaClient } from '@prisma/client';
import { User } from 'src/user/user.entity';

const prisma = new PrismaClient();

const roles = [
  {
    id: 1,
    roleName: 'superintendent',
  },
  {
    id: 2,
    roleName: 'supervisor',
  },
];

const defaultAdmin: User = {
  id: '111111',
  password: 'admin123',
  name: 'default admin',
  roleID: 1,
};

async function seed() {
  for (const role of roles) {
    await prisma.roles.create({
      data: {
        id: role.id,
        roleName: role.roleName,
      },
    });
  }

  await prisma.users.create({
    data: defaultAdmin,
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    process.exit(1);
  });
