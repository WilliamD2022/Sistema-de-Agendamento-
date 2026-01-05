import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerCreateRequest, CustomerResponse, CustomerUpdateRequest } from './models';

@Injectable({
  providedIn: 'root'
})
export class CustomersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/customers';

  list() {
    return this.http.get<CustomerResponse[]>(this.baseUrl);
  }

  create(payload: CustomerCreateRequest) {
    return this.http.post<CustomerResponse>(this.baseUrl, payload);
  }

  update(id: string, payload: CustomerUpdateRequest) {
    return this.http.put<CustomerResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
