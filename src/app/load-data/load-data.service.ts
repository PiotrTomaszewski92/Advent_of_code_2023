import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoadDataService {
  constructor(private http: HttpClient) {}

  public loadData(fileName: string): Observable<string[]> {
    return this.http
      .get(`assets/${fileName}`, { responseType: 'text' })
      .pipe(map((data: string) => data.split('\n')));
  }
}
