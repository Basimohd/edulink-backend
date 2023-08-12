import { batchType } from 'admin/interfaces/batch.interface';
import { IsNotEmpty} from 'class-validator';

export class batchDto {

    readonly batchId: string;

    @IsNotEmpty()
    readonly department: string;

    @IsNotEmpty()
    readonly batch: batchType;

    @IsNotEmpty()
    readonly tutor: string;

    @IsNotEmpty()
    readonly maxSeats: number;
}


