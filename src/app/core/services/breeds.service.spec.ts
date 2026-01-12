import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { BreedsService } from './breeds.service';
import { IBreed } from '@shared/interfaces/breed.interface';

describe('BreedsService', () => {
  let service: BreedsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        BreedsService
      ]
    });

    service = TestBed.inject(BreedsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllBreeds', () => {
    it('should return an array of breeds', () => {
      const mockBreeds: IBreed[] = [
        {
          id: 'abys',
          name: 'Abyssinian',
          origin: 'Egypt',
          temperament: 'Active, Energetic'
        },
        {
          id: 'beng',
          name: 'Bengal',
          origin: 'United States',
          temperament: 'Alert, Agile'
        }
      ];

      service.getAllBreeds().subscribe(breeds => {
        expect(breeds.length).toBe(2);
        expect(breeds[0].name).toBe('Abyssinian');
        expect(breeds[1].name).toBe('Bengal');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/breeds');
      expect(req.request.method).toBe('GET');
      req.flush(mockBreeds);
    });
  });

  describe('searchBreeds', () => {
    it('should search breeds by query', () => {
      const mockBreeds: IBreed[] = [
        {
          id: 'beng',
          name: 'Bengal',
          origin: 'United States',
          temperament: 'Alert, Agile'
        }
      ];

      service.searchBreeds('Bengal').subscribe(breeds => {
        expect(breeds.length).toBe(1);
        expect(breeds[0].name).toBe('Bengal');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/breeds/search?q=Bengal');
      expect(req.request.method).toBe('GET');
      req.flush(mockBreeds);
    });
  });
});
