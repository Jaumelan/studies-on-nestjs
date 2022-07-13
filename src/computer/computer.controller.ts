import { Controller, Get } from '@nestjs/common';
import { CpuService } from '../cpu/cpu.service';
import { DiskService } from '../disk/disk.service';

@Controller('computer')
export class ComputerController {
  constructor(
    private cpuService: CpuService,
    private diskService: DiskService,
  ) {}

  @Get()
  run() {
    const cpu = this.cpuService.compute(1, 2);
    const disk = this.diskService.getData();

    return [`CPU: ${cpu}`, `Disk: ${disk}`];
  }
}
