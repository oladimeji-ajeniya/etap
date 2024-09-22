import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private cache: Map<string, any> = new Map();

  async set(key: string, value: any): Promise<void> {
    this.cache.set(key, value);
  }

  async get(key: string): Promise<any> {
    return this.cache.get(key);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}