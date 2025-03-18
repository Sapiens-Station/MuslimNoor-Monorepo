import { Injectable } from '@nestjs/common';

@Injectable()
export class DonationsService {
    private donations = []; // Temporary storage (Replace with DB logic later)

    findAll() {
    return this.donations;
  }
}
