import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class ItemsController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    async getUsers(): Promise<User[]> {
        return this.userService.getItems();
    }

}
