import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CorporateController } from './corporate.controller';
import { CorporateService } from './corporate.service';
import { Corporate, CorporateSchema } from './corporate.schema';

class MockCorporateModel {
    static storage = [];
    data: any;

    constructor(data: any) {
        this.data = data;
    }

    save() {
        this.data._id = Date.now().toString();
        MockCorporateModel.storage.push(this.data);
        return Promise.resolve(this.data);
    }

    static find(filter: any) {
        return {
            exec: () => {
                if (!filter || Object.keys(filter).length === 0) {
                    return Promise.resolve(MockCorporateModel.storage);
                }
                return Promise.resolve(MockCorporateModel.storage.filter(item => {
                    for (const key in filter) {
                        if (item[key] !== filter[key]) return false;
                    }
                    return true;
                }));
            }
        }
    }
}

@Module({
    imports: [MongooseModule.forFeature([{ name: Corporate.name, schema: CorporateSchema }])],
    controllers: [CorporateController],
    providers: [
        CorporateService,
    ],
})
export class CorporateModule { }
