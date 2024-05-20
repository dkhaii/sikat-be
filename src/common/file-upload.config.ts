import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export const MulterConfig = {
  fileDestination: process.env.FILE_UPLOAD_LOCATION,
  imgDestination: process.env.IMG_UPLOAD_LOCATION,
};

export const FilePipeBuilderPDFOption = new ParseFilePipeBuilder()
  .addMaxSizeValidator({ maxSize: 2000000 })
  .addFileTypeValidator({ fileType: '.(pdf)' })
  .build({
    fileIsRequired: false,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });

export const FilePipeBuilderIMGOption = new ParseFilePipeBuilder()
  .addMaxSizeValidator({ maxSize: 2000000 })
  .addFileTypeValidator({ fileType: '.(pdf)' })
  .build({
    fileIsRequired: false,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });

export const MulterFileOption = diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = MulterConfig.fileDestination;

    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + uuid();
    const filename = `${uniqueSuffix}.${file.originalname.split('.').pop()}`;

    callback(null, filename);
  },
});

export const MulterImgOption = diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = MulterConfig.imgDestination;

    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + uuid();
    const filename = `${uniqueSuffix}.${file.originalname.split('.').pop()}`;

    callback(null, filename);
  },
});
