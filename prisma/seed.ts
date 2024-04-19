import { PrismaClient } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roles = [
  {
    id: 1,
    name: 'superintendent',
  },
  {
    id: 2,
    name: 'supervisor',
  },
];

const defaultAdmin: User = {
  id: '111111',
  password: bcrypt.hashSync('admin123', 10),
  name: 'default admin',
  roleID: 1,
};

const bases = [
  {
    id: 1,
    name: 'm2',
  },
  {
    id: 2,
    name: 'oscar base',
  },
];

const crews = [
  {
    id: 1,
    name: 'alpha',
  },
  {
    id: 2,
    name: 'bravo',
  },
  {
    id: 3,
    name: 'charlie',
  },
];

const pits = [
  {
    id: 1,
    name: 'bintang',
  },
  {
    id: 2,
    name: 'hatari',
  },
  {
    id: 3,
    name: 'jupiter',
  },
];

const positions = [
  {
    id: 1,
    name: 'superintendent',
  },
  {
    id: 2,
    name: 'engineer',
  },
  {
    id: 3,
    name: 'specialist',
  },
  {
    id: 4,
    name: 'supervisor',
  },
  {
    id: 5,
    name: 'triner',
  },
  {
    id: 6,
    name: 'gdp',
  },
  {
    id: 7,
    name: 'dispatcher',
  },
  {
    id: 8,
    name: 'assistant',
  },
  {
    id: 9,
    name: 'operator magang',
  },
  {
    id: 10,
    name: 'dispatch',
  },
  {
    id: 11,
    name: 'mining',
  },
  {
    id: 12,
    name: 'senior',
  },
  {
    id: 13,
    name: 'junior',
  },
];

async function seedRoles() {
  for (const role of roles) {
    await prisma.roles.create({
      data: {
        id: role.id,
        roleName: role.name,
      },
    });
  }
}

async function seedUsers() {
  await prisma.users.create({
    data: defaultAdmin,
  });
}

async function seedBases() {
  for (const base of bases) {
    await prisma.bases.create({
      data: {
        id: base.id,
        name: base.name,
      },
    });
  }
}

async function seedCrews() {
  for (const crew of crews) {
    await prisma.crews.create({
      data: {
        id: crew.id,
        name: crew.name,
      },
    });
  }
}

async function seedPits() {
  for (const pit of pits) {
    await prisma.pits.create({
      data: {
        id: pit.id,
        name: pit.name,
      },
    });
  }
}

async function seedPositions() {
  for (const position of positions) {
    await prisma.positions.create({
      data: {
        id: position.id,
        name: position.name,
      },
    });
  }
}

seedRoles()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    process.exit(0);
  });

seedUsers()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    process.exit(0);
  });

seedBases()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    process.exit(0);
  });

seedCrews()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    process.exit(0);
  });

seedPits()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    process.exit(0);
  });

seedPositions()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    process.exit(1);
  });
