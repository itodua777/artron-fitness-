
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Doc, DocSchema } from './document.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Doc.name, schema: DocSchema }])],
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule { }
