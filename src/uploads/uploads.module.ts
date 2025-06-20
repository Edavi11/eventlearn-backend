import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MulterExceptionInterceptor } from './interceptors/multer-exception.interceptor';
import { UploadCategory } from './enums/upload-category.enum';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, callback) => {
          let subDir = 'others';
          if (file.mimetype.startsWith('image/')) {
            subDir = 'images';
          } else if (file.mimetype.startsWith('video/')) {
            subDir = 'videos';
          } else if (file.mimetype.startsWith('application/pdf')) {
            subDir = 'documents';
          }
          
          callback(null, `./uploads/${subDir}`);
        },
        filename: (req, file, callback) => {
          const uniqueId = uuidv4();
          callback(null, `${uniqueId}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Validar tipos de archivo según el contexto
        if (file.fieldname === 'profile_picture') {
          if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
          }
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MulterExceptionInterceptor,
    },
  ],
  exports: [MulterModule],
})
export class UploadsModule {} 