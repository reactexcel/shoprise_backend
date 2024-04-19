
import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron'
import { BlogService } from '../../blog/blog.service';

@Injectable()
export class BlogScheduler{
  constructor(private scheduleService: BlogService) {}

  startScheduler() {
    cron.schedule('* * * * *', async () => {
      const pendingTasks = await this.scheduleService.getScheduledBlog();
      pendingTasks.forEach(async task => {
        await this.scheduleService.updateBlog(task.id, {status:"published", createdAt:new Date(task.scheduledDate), scheduledDate:null});
      });
    });
  }
}
