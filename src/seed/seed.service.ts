import { Injectable } from '@nestjs/common';

import { UserRole } from 'src/common/enums/user.role';
import { Role } from 'src/roles/entities/role.model';

@Injectable()
export class SeedService {

  async ExecuteSeed() {
    await this.seedRoles();
    return { message: 'Seed ejecutado exitosamente.' };
  }

  private async seedRoles() {

    const existing = await Role.count();
    if (existing > 0) {
      console.log('⚠️ Roles ya existen. Saltando...');
      return;
    }

    await Role.bulkCreate([
      { rol: UserRole.Student },
      { rol: UserRole.Instructor },
      { rol: UserRole.Admin },
    ]);

    console.log('✅ Roles insertados.');
  }

}
