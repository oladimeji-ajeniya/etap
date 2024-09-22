import { ApiProperty } from '@nestjs/swagger';

export class UserRankingDto {
    @ApiProperty({ example: 3, description: 'ID of the user' })
    userId: number;

    @ApiProperty({ example: 'Olad Ajeniya', description: 'Name of the user' })
    name: string;

    @ApiProperty({ example: 'ola@emple.com', description: 'Email of the user' })
    email: string;

    @ApiProperty({ example: 79, description: 'Total watch time percentage' })
    totalWatchTime: number;
}
