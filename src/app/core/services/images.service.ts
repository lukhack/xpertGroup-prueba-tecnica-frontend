import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '@environments/environment';
import { ICatImage } from '@shared/interfaces/cat-image.interface';
import { CatImage } from '@shared/models/cat-image.model';
import { ApiResponse } from '@shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get images for a specific breed
   */
  getImagesByBreedId(breedId: string): Observable<CatImage[]> {
    const params = new HttpParams().set('breed_id', breedId);
    return this.http.get<ApiResponse<ICatImage[]>>(`${this.API_URL}/images/imagesbybreedid`, { params })
      .pipe(
        map(response => response.data.map(img => this.mapToCatImageModel(img)))
      );
  }

  /**
   * Map API response to CatImage model
   */
  private mapToCatImageModel(data: ICatImage): CatImage {
    return new CatImage(
      data.id,
      data.url,
      data.width,
      data.height
    );
  }
}
