import { ObjectId } from 'mongodb';

export class IdGenerator {
  private static generateRandomString(length: number = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Custom readable ID generation (current approach)
  public static generatePartId(name: string): string {
    const sanitizedName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const randomSuffix = this.generateRandomString(4);
    return `${sanitizedName}-${randomSuffix}`;
  }

  // Alternative: Use MongoDB's default ObjectId (24-character hex string)
  public static generateMongoId(): string {
    return new ObjectId().toString();
  }

  // Alternative: Use MongoDB ObjectId with readable prefix
  public static generatePartIdWithObjectId(name: string): string {
    const sanitizedName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 10); // Limit length
    
    const objectId = new ObjectId().toString();
    return `${sanitizedName}-${objectId}`;
  }

  // Alternative: Sequential counter-based ID (requires database counter)
  public static generateSequentialId(name: string, counter: number): string {
    const sanitizedName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${sanitizedName}-${counter.toString().padStart(3, '0')}`;
  }
}