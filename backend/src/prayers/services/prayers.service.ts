import { Injectable } from '@nestjs/common';

@Injectable()
export class PrayersService { 
    private prayers = []; // Temporary storage (Replace with DB logic later)

    findAll() {
      return this.prayers;
    }}
