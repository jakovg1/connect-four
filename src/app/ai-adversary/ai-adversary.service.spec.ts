import { TestBed } from '@angular/core/testing';

import { AiAdversaryService } from './ai-adversary.service';

describe('AiAdversaryService', () => {
  let service: AiAdversaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiAdversaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
