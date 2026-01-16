import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '../exceptions/forbidden.exception';

@Injectable()
export class AuthorizationService {
  isOwner(userId: string, resourceOwnerId: string): boolean {
    return userId === resourceOwnerId;
  }

  checkOwnership(userId: string, resourceOwnerId: string): void {
    if (!this.isOwner(userId, resourceOwnerId)) {
      throw new ForbiddenException();
    }
  }
}
