import { Test, TestingModule } from '@nestjs/testing';
import { PoitemsService } from './poitems.service';

describe('PoitemsService', () => {
  let service: PoitemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoitemsService],
    }).compile();

    service = module.get<PoitemsService>(PoitemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
