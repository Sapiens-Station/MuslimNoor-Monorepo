import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  private events = []; // Temporary storage (Replace with DB logic later)

  findAll() {
    return this.events;
  }
}
