import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <mat-icon>pets</mat-icon>
          <span>Cat Breeds App</span>
        </div>

        <nav class="navbar-menu">
          <a mat-button routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon>dashboard</mat-icon>
            Dashboard
          </a>
          <a mat-button routerLink="/search" routerLinkActive="active-link">
            <mat-icon>search</mat-icon>
            Búsqueda
          </a>

          @if (isAuthenticated()) {
            <a mat-button routerLink="/profile" routerLinkActive="active-link">
              <mat-icon>account_circle</mat-icon>
              Perfil
            </a>
            <button mat-button (click)="onLogout()" class="logout-btn">
              <mat-icon>logout</mat-icon>
              Salir
            </button>
          } @else {
            <a mat-button routerLink="/login" routerLinkActive="active-link">
              <mat-icon>login</mat-icon>
              Login
            </a>
            <a mat-button routerLink="/register" routerLinkActive="active-link">
              <mat-icon>person_add</mat-icon>
              Registro
            </a>
          }
        </nav>

        <!-- Mobile Menu -->
        <button mat-icon-button [matMenuTriggerFor]="mobileMenu" class="mobile-menu-btn">
          <mat-icon>menu</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <mat-menu #mobileMenu="matMenu">
      <button mat-menu-item routerLink="/dashboard">
        <mat-icon>dashboard</mat-icon>
        <span>Dashboard</span>
      </button>
      <button mat-menu-item routerLink="/search">
        <mat-icon>search</mat-icon>
        <span>Búsqueda</span>
      </button>
      @if (isAuthenticated()) {
        <button mat-menu-item routerLink="/profile">
          <mat-icon>account_circle</mat-icon>
          <span>Perfil</span>
        </button>
        <button mat-menu-item (click)="onLogout()">
          <mat-icon>logout</mat-icon>
          <span>Salir</span>
        </button>
      } @else {
        <button mat-menu-item routerLink="/login">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </button>
        <button mat-menu-item routerLink="/register">
          <mat-icon>person_add</mat-icon>
          <span>Registro</span>
        </button>
      }
    </mat-menu>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;
    }

    .navbar-brand mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .navbar-menu a,
    .navbar-menu button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .navbar-menu mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .active-link {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      color: rgba(255, 255, 255, 0.9);
    }

    .mobile-menu-btn {
      display: none;
    }

    @media (max-width: 768px) {
      .navbar-menu {
        display: none;
      }

      .mobile-menu-btn {
        display: block;
      }

      .navbar-brand span {
        font-size: 16px;
      }
    }
  `]
})
export class NavbarComponent {
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}
