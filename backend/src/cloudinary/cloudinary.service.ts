
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: string | Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (typeof file === 'string') {
                // Handle Base64 String
                cloudinary.uploader.upload(file, { folder: 'artron_members' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                });
            } else {
                // Handle Buffer (Multer File)
                // Use upload_stream for buffers
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'artron_employees' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }
                );

                // Write buffer to stream
                const Readable = require('stream').Readable;
                const stream = new Readable();
                stream.push(file.buffer);
                stream.push(null);
                stream.pipe(uploadStream);
            }
        });
    }

    // Helper to check if string is base64
    isBase64(str: string): boolean {
        if (!str) return false;
        return str.startsWith('data:image');
    }
}
