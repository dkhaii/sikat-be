import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CrewDto } from './dto/crew.dto';
import { Crew } from './entities/crew.entity';

@Injectable()
export class CrewsRepository {
  constructor(private prismaService: PrismaService) {}

  async findOneByID(id: number): Promise<CrewDto | null> {
    const crew = await this.prismaService.crews.findUnique({
      where: {
        id: id,
      },
      include: {
        employees: {
          where: {
            isArchived: false,
          },
          include: {
            position: true,
            crew: true,
            pit: true,
            base: true,
          },
        },
      },
    });

    if (!crew) {
      return null;
    }

    const crewDto = await this.mapEntityToDto(crew);

    return crewDto;
  }

  private async mapEntityToDto(crew: Crew): Promise<CrewDto> {
    const crewDto: CrewDto = {
      id: crew.id,
      name: crew.name,
      employees: [],
    };

    for (let i = 0; i < crew.employees.length; i++) {
      crewDto.employees.push({
        name: crew.employees[i].name,
        dateOfBirthStr: crew.employees[i].dateOfBirth.toLocaleDateString(),
        dateOfHireStr: crew.employees[i].dateOfHire.toLocaleDateString(),
        positionName: crew.employees[i].position.name,
        crewName: crew.employees[i].crew.name,
        pitName: crew.employees[i].pit.name,
        baseName: crew.employees[i].base.name,
      });
    }

    return crewDto;
  }
}
