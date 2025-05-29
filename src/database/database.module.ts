import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.model';
import { Role } from 'src/roles/entities/role.model';
import { UserRoleAssignment } from 'src/roles/entities/user_role.model';

@Global() // Make the database connection available throughout the app
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get<string>('NODE_ENV') !== 'prod';

        return {
          dialect: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadModels: true, // Automatically loads models (optional, can be explicit)
          synchronize: true,
          logging: console.log, // Enable logging of SQL queries
          models: [User, Role, UserRoleAssignment], // ✅ Aquí deben estar todos
          sync: isDev ? { force: true } : { force: false }, // Force sync in development mode
        }

      },
      inject: [ConfigService],
    }),
  ],
  exports: [SequelizeModule], // Export SequelizeModule so other modules can use it
})
export class DatabaseModule {}


