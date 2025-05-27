import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global() // Make the database connection available throughout the app
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadModels: true, // Automatically loads models (optional, can be explicit)
        synchronize: false, // DO NOT use in production: set to true to sync models with DB on app start (for dev only)
        logging: console.log, // Enable logging of SQL queries
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [SequelizeModule], // Export SequelizeModule so other modules can use it
})
export class DatabaseModule {}