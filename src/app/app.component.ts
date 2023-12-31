import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Day1Component } from '../day1/day1.component';
import { Day2Component } from '../day2/day2.component';
import { Day3Component } from '../day3/day3/day3.component';

@Component({
  standalone: true,
  selector: 'aoc-app',
  imports: [
    CommonModule,
    RouterOutlet,
    Day1Component,
    Day2Component,
    Day3Component,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'aoc2023';
}
