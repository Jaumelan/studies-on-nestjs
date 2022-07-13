import { Injectable } from '@nestjs/common';
import { PowerService } from '../power/power.service';
@Injectable()
export class CpuService {
  constructor(private powerService: PowerService) {}

  compute(a: number, b: number) {
    console.log(`Drawing ${a + b} watts from the power supply`);
    this.powerService.supplyPower(a + b);

    return a + b;
  }
}
