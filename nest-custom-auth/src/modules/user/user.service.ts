import { Injectable, NotFoundException } from '@nestjs/common';

import { DBService } from '../database/db.service';

import { hashPassword } from '../../utils/auth';
import { usersTable } from '../../db/schema';

import { CreateUserDTO } from './dto/user.dto';
import { register } from 'module';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DBService) {}

  async createUser(user: CreateUserDTO) {
    const hash: string | undefined = await hashPassword(user.password);

    if (!hash) throw new Error('Error while create a new user');

    // create new user object
    const newUser: typeof usersTable.$inferInsert = {
      name: user.name,
      email: user.email,
      password: hash,
    };

    // get db and insert into table
    const db = this.dbService.getDB();

    const registered = await db
      .insert(usersTable)
      .values(newUser)
      .returning({ id: usersTable.id });

    return {
      id: registered[0].id,
      email: user.email,
    };
  }

  // get all users from the users table
  async get() {
    const db = this.dbService.getDB();
    const users = await db.select().from(usersTable);
    return users;
  }

  async findOne(email: string) {
    const db = this.dbService.getDB();
    email = email.trim().toLowerCase();

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (user.length === 0) throw new NotFoundException();

    return user[0];
  }
}
