import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BackupService {
    private readonly logger = new Logger(BackupService.name);

    /*@Cron('45 * * * * *')
    handleCron() {
        this.logger.debug('Called when the current second is 45');

    }*/

}
