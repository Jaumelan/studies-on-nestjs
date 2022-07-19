import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }

  async approve(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id, 10) } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;

    return this.repo.save(report);
  }
}
