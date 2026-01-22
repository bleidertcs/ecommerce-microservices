import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    @EventPattern('post.created')
    handlePostCreated(@Payload() data: any) {
        this.logger.log(`Received 'post.created' event: ${JSON.stringify(data)}`);
        // Here you could perform actions like:
        // - Invalidating caches
        // - Updating user statistics
        // - Sending notifications
    }
}
