import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { BreedsService } from '@core/services/breeds.service';
import { Breed } from '@shared/models/breed.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchControl = new FormControl('');
  searchResults = signal<Breed[]>([]);
  isLoading = signal(false);
  searchPerformed = signal(false);
  lastSearchTerm = signal('');

  displayedColumns: string[] = ['name', 'origin', 'temperament', 'life_span', 'description'];

  constructor(private breedsService: BreedsService) {}

  onSearch(): void {
    const query = this.searchControl.value?.trim();
    if (!query) return;

    this.isLoading.set(true);
    this.searchPerformed.set(true);
    this.lastSearchTerm.set(query);

    this.breedsService.searchBreeds(query).subscribe({
      next: (breeds) => {
        this.searchResults.set(breeds);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error searching breeds:', error);
        this.searchResults.set([]);
        this.isLoading.set(false);
      }
    });
  }
}
