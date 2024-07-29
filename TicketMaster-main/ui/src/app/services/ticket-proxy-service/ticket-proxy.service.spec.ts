import { TestBed } from '@angular/core/testing';

import { TicketProxyService } from './ticket-proxy.service';

describe('TicketProxyService', () => {
  let service: TicketProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
