import { Test, TestingModule } from '@nestjs/testing';
import { PoitemsController } from './poitems.controller';

describe('PoitemsController', () => {
  let controller: PoitemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoitemsController],
    }).compile();

    controller = module.get<PoitemsController>(PoitemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
