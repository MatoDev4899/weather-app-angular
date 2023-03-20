import { TestBed } from '@angular/core/testing';

import { HeatIndexService } from '../../features/heat-index/heat-index.service';

describe('HeatIndexService', () => {
  let service: HeatIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeatIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
