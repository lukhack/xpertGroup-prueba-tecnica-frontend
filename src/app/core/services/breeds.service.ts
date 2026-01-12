import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '@environments/environment';
import { IBreed } from '@shared/interfaces/breed.interface';
import { Breed } from '@shared/models/breed.model';
import { ApiResponse } from '@shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class BreedsService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all cat breeds
   */
  getAllBreeds(): Observable<Breed[]> {
    return this.http.get<ApiResponse<IBreed[]>>(`${this.API_URL}/breeds`)
      .pipe(
        map(response => response.data.map(b => this.mapToBreedModel(b)))
      );
  }

  /**
   * Get a specific breed by ID
   */
  getBreedById(breedId: string): Observable<Breed> {
    return this.http.get<ApiResponse<IBreed>>(`${this.API_URL}/breeds/${breedId}`)
      .pipe(
        map(response => this.mapToBreedModel(response.data))
      );
  }

  /**
   * Search breeds by query
   */
  searchBreeds(query: string): Observable<Breed[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ApiResponse<IBreed[]>>(`${this.API_URL}/breeds/search`, { params })
      .pipe(
        map(response => response.data.map(b => this.mapToBreedModel(b)))
      );
  }

  /**
   * Map API response to Breed model
   */
  private mapToBreedModel(data: IBreed): Breed {
    return new Breed(
      data.id,
      data.name,
      data.origin,
      data.temperament,
      data.description,
      data.life_span,
      data.weight,
      data.wikipedia_url
    );
  }
}
