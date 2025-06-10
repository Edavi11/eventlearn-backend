import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, callback) => {
          // Determinar el subdirectorio basado en el tipo de archivo
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
    }),
  ],
  exports: [MulterModule],
})
export class UploadsModule {} 