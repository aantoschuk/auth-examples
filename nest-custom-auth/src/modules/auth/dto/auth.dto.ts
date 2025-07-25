import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateRefreshTokenDTO {
  userEmail: string;
  hash: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  expiresAt: string;
}
