import { TestBed } from '@angular/core/testing';

import { ResultHistoryService } from './result-history.service';
describe('LocalStorageService', () => {
  let service: ResultHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
