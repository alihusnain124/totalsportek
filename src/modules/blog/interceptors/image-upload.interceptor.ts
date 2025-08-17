import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnsupportedMediaTypeException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { extname } from 'path';
import * as multer from 'multer';
import * as fs from 'fs';
import { catchError } from 'rxjs/operators';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

const storage = multer.diskStorage({
  destination: './public/images',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    callback(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new UnsupportedMediaTypeException('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

@Injectable()
export class ImageUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return new Promise<Observable<any>>((resolve, reject) => {
      upload.single('file')(request, request.res, (err: any) => {
        if (err) {
          return reject(err);
        }

        // file is uploaded successfully, proceed to handle()
        const file = request.file;

        const stream$ = next.handle().pipe(
          catchError((error) => {
            // Delete the uploaded file if error happens downstream
            if (file && file.path) {
              try {
                fs.unlinkSync(file.path); // delete the file synchronously
              } catch (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
              }
            }
            throw error;
          }),
        );

        resolve(stream$);
      });
    }) as unknown as Observable<any>;
  }
}
