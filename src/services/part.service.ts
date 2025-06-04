import mongoose from 'mongoose';
import { PartModel } from '../models/part.model';
import { CreatePartDto, AddInventoryDto } from '../validators/part.validator';
import { Part, PartType } from '../types/part';
import { IdGenerator } from '../utils/id.generator';
import { 
  NotFoundError, 
  ConflictError, 
  InsufficientInventoryError,
  ValidationError 
} from '../errors/app.error';

export class PartService {
  private idGenerator: IdGenerator;
    constructor() {
    this.idGenerator = new IdGenerator();
  }
  public async createPart(createPartDto: CreatePartDto): Promise<Part> {
    
    try {
      let createdPart: any;
      
        // Validate constituent parts exist for assembled parts
        if (createPartDto.type === PartType.ASSEMBLED && createPartDto.parts) {
          await this.validateConstituentParts(createPartDto.parts);
          await this.checkCircularDependency(createPartDto.name, createPartDto.parts);
        }

        const id = IdGenerator.generatePartId(createPartDto.name);
        const part = new PartModel({
          name: createPartDto.name,
          _id: id,
          type: createPartDto.type,
          quantityInStock: 0,
          parts: createPartDto.parts
        });

        createdPart = await part.save();

      // Convert to API response format
      return {
        id: createdPart._id.toString(),
        name: createdPart.name,
        type: createdPart.type,
        quantityInStock: createdPart.quantityInStock,
        parts: createdPart.parts,
        createdAt: createdPart.createdAt,
        updatedAt: createdPart.updatedAt
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new ConflictError('Part with this name already exists');
      }
      throw error;
    } finally {




    }
  }

  public async addInventory(partId: string, addInventoryDto: AddInventoryDto): Promise<void> {
    
    try {
        const part = await PartModel.findById(partId);
        
        if (!part) {
          throw new NotFoundError(`Part with id ${partId} not found`);
        }

        if (part.type === PartType.RAW) {
          await this.addRawPartInventory(part, addInventoryDto.quantity);
        } else {
          console.log(part)
          await this.addAssembledPartInventory(part, addInventoryDto.quantity);
        }
    } finally {
    }
  }

  public async getPartById(partId: string): Promise<Part | null> {
    const part = await PartModel.findById(partId).lean();
    if (!part) return null;
    
    return {
      id: part._id.toString(),
      name: part.name,
      type: part.type,
      quantityInStock: part.quantityInStock,
      parts: part.parts,
      createdAt: part.createdAt,
      updatedAt: part.updatedAt
    };
  }

  public async getAllParts(): Promise<Part[]> {
    const parts = await PartModel.find({}).lean();
    return parts.map(part => ({
      id: part._id.toString(),
      name: part.name,
      type: part.type,
      quantityInStock: part.quantityInStock,
      parts: part.parts,
      createdAt: part.createdAt,
      updatedAt: part.updatedAt
    }));
  }

  private async addRawPartInventory(
    part: any, 
    quantity: number, 
  ): Promise<void> {
    part.quantityInStock += quantity;
    await part.save();
  }



  private async addAssembledPartInventory(
    part: any, 
    quantity: number, 
  ): Promise<void> {
    // Check if all constituent parts have sufficient inventory
    for (const constituent of part.parts) {
      const requiredQuantity = constituent.quantity * quantity;
      const constituentPart = await PartModel.findById(constituent.id);
      if (!constituentPart) {
        throw new NotFoundError(`Constituent part ${constituent.id} not found`);
      }
      console.log(constituent.id,constituentPart.quantityInStock);
      console.log("requiredQuantity",requiredQuantity);
      
      if (constituentPart.quantityInStock < requiredQuantity) {
        throw new InsufficientInventoryError(constituent.id);
      }
    }

    // Deduct constituent parts
    for (const constituent of part.parts) {
      const requiredQuantity = constituent.quantity * quantity;
      await PartModel.updateOne(
        { _id: constituent.id },
        { $inc: { quantityInStock: -requiredQuantity } },
        
      );
    }

    // Add assembled parts to inventory
    part.quantityInStock += quantity;
    await part.save();
  }

private async validateConstituentParts(parts: any[]): Promise<void> {
    const partIds = parts.map(p => p.id);
    const existingParts = await PartModel.find({ _id: { $in: partIds } }).lean(); // returns plain JS objects
    
    if (existingParts.length !== partIds.length) {
      const existingIds = existingParts.map((p: any) => p._id.toString());
      const missingIds = partIds.filter(id => !existingIds.includes(id));
      throw new NotFoundError(`Constituent parts not found: ${missingIds.join(', ')}`);
    }
  }

  private async checkCircularDependency(
    partName: string, 
    parts: any[], 
    visited: Set<string> = new Set()
  ): Promise<void> {
    if (visited.has(partName)) {
      throw new ValidationError('Circular dependency detected');
    }

    visited.add(partName);

    for (const constituent of parts) {
      const constituentPart = await PartModel.findById(constituent.id);
      if (constituentPart && constituentPart.type === PartType.ASSEMBLED && constituentPart.parts) {
        await this.checkCircularDependency(constituentPart.name, constituentPart.parts, new Set(visited));
      }
    }
  }
}
