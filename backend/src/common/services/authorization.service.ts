import { Injectable, Logger } from '@nestjs/common';
import { ForbiddenException } from '../exceptions/forbidden.exception';

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);

  isOwner(userId: string, resourceOwnerId: string): boolean {
    return userId === resourceOwnerId;
  }

  checkOwnership(userId: string, resourceOwnerId: string): void {
    if (!this.isOwner(userId, resourceOwnerId)) {
      this.logger.warn(
        `Unauthorized access attempt - userId: ${userId} tried to access resource owned by: ${resourceOwnerId}`,
      );
      throw new ForbiddenException();
    }
  }
}
