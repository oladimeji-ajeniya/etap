import { IsString} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiPropertyOptional({ example: 'admin', description: 'Updated the user role' })
  @IsString()
  role: string;
}
