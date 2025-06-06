import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

import { User } from 'src/users/entities/user.model';
import { UserRoleAssignment } from 'src/roles/entities/user_role.model';
import { UserRole } from 'src/common/enums/user.role';
import { Role } from 'src/roles/entities/role.model';

@Injectable()
export class SeedService {

  async ExecuteSeed() {
    await this.seedRoles();
    await this.seedVerifiedUser();
    return { message: 'Seed Executed' };
  }

  private async seedRoles() {

    const existing = await Role.count();
    if (existing > 0) {
      console.log('⚠️ Roles already exist. Skipping seedRoles...');
      return;
    }

    await Role.bulkCreate([
      { rol: UserRole.STUDENT },
      { rol: UserRole.INSTRUCTOR },
      { rol: UserRole.ADMIN },
    ]);

    console.log('✅ Roles seeded successfully:');
  }

  private async seedVerifiedUser() {
    const testEmail = 'test@example.com';

    const existingUser = await User.findOne({ where: { email: testEmail } });
    if (existingUser) {
      console.log(`⚠️ User with email ${testEmail} already exists. Skipping seedVerifiedUser...`);
      return;
    }

    const hashedPassword = await bcrypt.hash('testpaswoord123', 10);
    const user = await User.create({
      email: testEmail,
      password: hashedPassword,
      name: 'Usuario Verificado',
      is_verified: true,
      is_active: true,
    });

    const role = await Role.findOne({ where: { rol: UserRole.STUDENT } });
    if (!role) {
      console.error('❌ Role "STUDENT" not found. Cannot assign role to user.');
      return;
    }

    await UserRoleAssignment.create({
      user_id: user.id,
      role_id: role.id,
    });

    console.log(`✅ User seeded successfully: ${user.email}`);
  }
}