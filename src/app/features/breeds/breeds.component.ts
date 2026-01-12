import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BreedsService } from '@core/services/breeds.service';
import { ImagesService } from '@core/services/images.service';
import { Breed } from '@shared/models/breed.model';
import { CatImage } from '@shared/models/cat-image.model';

@Component({
  selector: 'app-breeds',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './breeds.component.html',
  styleUrl: './breeds.component.css'
})
export class BreedsComponent implements OnInit {
  breeds = signal<Breed[]>([]);
  selectedBreed = signal<Breed | null>(null);
  breedImages = signal<CatImage[]>([]);
  currentImageIndex = signal(0);
  loadingBreeds = signal(false);
  loadingImages = signal(false);

  selectedBreedControl = new FormControl('');
  displayedColumns: string[] = ['name', 'origin', 'temperament'];

  constructor(
    private breedsService: BreedsService,
    private imagesService: ImagesService
  ) {}

  ngOnInit(): void {
    this.loadBreeds();
    this.setupBreedSelectionListener();
  }

  private loadBreeds(): void {
    this.loadingBreeds.set(true);
    this.breedsService.getAllBreeds().subscribe({
      next: (breeds) => {
        this.breeds.set(breeds);
        this.loadingBreeds.set(false);
      },
      error: (error) => {
        console.error('Error loading breeds:', error);
        this.loadingBreeds.set(false);
      }
    });
  }

  private setupBreedSelectionListener(): void {
    this.selectedBreedControl.valueChanges.subscribe((breedId) => {
      if (breedId) {
        this.loadBreedDetails(breedId);
      }
    });
  }

  private loadBreedDetails(breedId: string): void {
    const breed = this.breeds().find(b => b.id === breedId);
    if (breed) {
      this.selectedBreed.set(breed);
      this.loadBreedImages(breedId);
    }
  }

  private loadBreedImages(breedId: string): void {
    this.loadingImages.set(true);
    this.currentImageIndex.set(0);
    this.imagesService.getImagesByBreedId(breedId).subscribe({
      next: (images) => {
        this.breedImages.set(images);
        this.loadingImages.set(false);
      },
      error: (error) => {
        console.error('Error loading images:', error);
        this.breedImages.set([]);
        this.loadingImages.set(false);
      }
    });
  }

  selectBreedFromTable(breed: Breed): void {
    this.selectedBreedControl.setValue(breed.id);
  }

  nextImage(): void {
    const images = this.breedImages();
    if (images.length > 0) {
      this.currentImageIndex.set((this.currentImageIndex() + 1) % images.length);
    }
  }

  previousImage(): void {
    const images = this.breedImages();
    if (images.length > 0) {
      const newIndex = this.currentImageIndex() - 1;
      this.currentImageIndex.set(newIndex < 0 ? images.length - 1 : newIndex);
    }
  }
}
