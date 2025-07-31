import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-base',
  imports: [CommonModule, LucideAngularModule, RouterModule],
  standalone: true,
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss',
})
export class BaseComponent {
  constructor() {}

  navItems = [
    { href: '/books', label: 'Livros', icon: 'book' },
    { href: '/authors', label: 'Autores', icon: 'users' },
    { href: '/genres', label: 'Gêneros', icon: 'tag' },
  ];

  isActive(path: string): boolean {
    return true;
  }
}
