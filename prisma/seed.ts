import { PrismaClient } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Employee } from 'src/employee/entities/employee.entity';
import { v4 as uuid } from 'uuid';

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
    name: 'senior dispatch engineer',
  },
  {
    id: 3,
    name: 'senior mining engineer',
  },
  {
    id: 4,
    name: 'specialist dispatch',
  },
  {
    id: 5,
    name: 'supervisor',
  },
  {
    id: 6,
    name: 'triner',
  },
  {
    id: 7,
    name: 'gdp',
  },
  {
    id: 8,
    name: 'dispatcher',
  },
  {
    id: 9,
    name: 'assistant dispatcher',
  },
  {
    id: 10,
    name: 'operator magang',
  },
];

const leaveStatus = [
  {
    id: 1,
    name: 'annual leave',
  },
  {
    id: 2,
    name: 'sick leave',
  },
  {
    id: 3,
    name: 'business trip',
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

async function seedEmployees() {
  await new Promise((f) => setTimeout(f, 10000));

  const amountOfUsers = 50;

  const employees: Employee[] = [];

  for (let i = 0; i < amountOfUsers; i++) {
    const employee: Employee = {
      id: uuid(),
      name: faker.person.fullName(),
      profilePicture: uuid(),
      dateOfBirth: faker.date.birthdate(),
      dateOfHire: faker.date.past(),
      positionID: faker.helpers.arrayElement(positions).id,
      crewID: faker.helpers.arrayElement(crews).id,
      pitID: faker.helpers.arrayElement(pits).id,
      baseID: faker.helpers.arrayElement(bases).id,
      isArchived: faker.datatype.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    employees.push(employee);
  }
  console.log(employees);

  for (const employee of employees) {
    await prisma.employees.create({
      data: {
        id: employee.id,
        name: employee.name,
        profilePicture: employee.profilePicture,
        dateOfBirth: employee.dateOfBirth,
        dateOfHire: employee.dateOfHire,
        positionID: employee.positionID,
        crewID: employee.crewID,
        pitID: employee.pitID,
        baseID: employee.baseID,
        isArchived: employee.isArchived,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      },
    });
  }
}

async function seedLeaveStatus() {
  for (const status of leaveStatus) {
    await prisma.leaveStatus.create({
      data: status,
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
    // process.exit(0);
  });

seedUsers()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    // process.exit(0);
  });

seedPositions()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    // process.exit(0);
  });

seedBases()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    // process.exit(0);
  });

seedCrews()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    // process.exit(0);
  });

seedPits()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    // process.exit(0);
  });

seedEmployees()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    // process.exit(1);
  });

seedLeaveStatus()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect;
    process.exit(1);
  });
