import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { User } from '../models/User';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ 
      imports:[],
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUserById', (done: DoneFn) => {
    service.getUser('5c6a5b7d-c102-4bf5-9d6a-752f5e5e1351').subscribe(value => {
      expect(value.result).toBeTruthy();
      done();
    })
  })
});
