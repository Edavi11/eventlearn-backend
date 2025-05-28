import { Sequelize } from 'sequelize-typescript';

import { User } from '../../users/entities/user.model';
import { Role } from '../../roles/entities/role.model';
import { UserRoleAssignment } from 'src/roles/entities/user_role.model';
import { UserRole } from 'src/common/enums/user.role';

async function seed() {

  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 5559,
    username: process.env.DB_USER || 'Admin',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'EventLearn',
    models: [User, Role, UserRoleAssignment],
    logging: false,
  });

  try {
    console.log('🌱 Starting seed...');

    // Ejecuta tus funciones de seed
    await seedRoles();

    console.log('✅ Seeding complete.');
    await sequelize.close();
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

async function seedRoles() {
    const existing = await Role.findAll();
    
    if (existing.length > 0) {
        console.log('⚠️ Roles already exist. Skipping.');
        return;
    }

    await Role.bulkCreate([
      { name: UserRole.Student },
      { name: UserRole.Instructor },
      { name: UserRole.Admin },
    ]);
    

  console.log('✅ Roles seeded.');
}

seed();
