import { Request, Response, NextFunction } from 'express';
import { PartService } from '../services/part.service';
import { CreatePartDto, AddInventoryDto } from '../validators/part.validator';
import { validateDto } from '../middleware/validation.middleware';

export class PartController {
  private partService: PartService;

  constructor() {
    this.partService = new PartService();
  }

  public createPart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      
      const createPartDto = await validateDto(CreatePartDto, req.body);
      const part = await this.partService.createPart(createPartDto);
      
      const response = {
        id: part.id,
        name: part.name,
        type: part.type,
        ...(part.parts && { parts: part.parts })
      };

      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  };

  public addInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const partId = req.params.partId;
      const addInventoryDto = await validateDto(AddInventoryDto, req.body);
      
      await this.partService.addInventory(partId, addInventoryDto);
      
      res.json({ status: 'SUCCESS' });
    } catch (error) {
      next(error);
    }
  };

  public getPartById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const partId = req.params.partId;
      const part = await this.partService.getPartById(partId);
      
      if (!part) {
         res.status(404).json({ 
          status: 'FAILED', 
          message: `Part with id ${partId} not found` 
        });
      }

      res.json(part);
    } catch (error) {
      next(error);
    }
  };

  public getAllParts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parts = await this.partService.getAllParts();
      res.json(parts);
    } catch (error) {
      next(error);
    }
  };
}