import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadDataService } from '../app/load-data/load-data.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'aoc-day1',
  imports: [CommonModule, HttpClientModule],
  providers: [LoadDataService],
  templateUrl: './day1.component.html',
})
export class Day1Component implements OnDestroy {
  private readonly DAY_1_FILE_NAME: string = 'day1_part1.txt';

  private readonly WORD_WITH_NUMBER_MAP: Map<string, number> = new Map([
    ['one', 1],
    ['1', 1],
    ['two', 2],
    ['2', 2],
    ['three', 3],
    ['3', 3],
    ['four', 4],
    ['4', 4],
    ['five', 5],
    ['5', 5],
    ['six', 6],
    ['6', 6],
    ['seven', 7],
    ['7', 7],
    ['eight', 8],
    ['8', 8],
    ['nine', 9],
    ['9', 9],
  ]);

  public firstSolution!: number;
  public secondSolution!: number;

  private firstSubscription!: Subscription;
  private secondSubscription!: Subscription;

  constructor(private loadDataService: LoadDataService) {}

  public ngOnDestroy(): void {
    this.firstSubscription.unsubscribe();
    this.secondSubscription.unsubscribe();
  }

  public onLoadFirstSolution(): void {
    this.firstSubscription = this.loadDataService
      .loadData(this.DAY_1_FILE_NAME)
      .subscribe((calibrationValues: string[]) => {
        this.firstSolution = this.solveFirstProblemWith(calibrationValues);
      });
  }

  public onLoadSecondSolution(): void {
    this.secondSubscription = this.loadDataService
      .loadData(this.DAY_1_FILE_NAME)
      .subscribe((calibrationValues: string[]) => {
        this.secondSolution = this.solveSecondProblemWith(calibrationValues);
      });
  }

  private solveFirstProblemWith(calibrationValues: string[]): number {
    return this.getSumOfFirstAndLastDigit(calibrationValues);
  }

  private solveSecondProblemWith(calibrationValues: string[]): number {
    let sum: number = 0;
    const numberLetters: string[] = Array.from(
      this.WORD_WITH_NUMBER_MAP.keys()
    );

    calibrationValues.map((text: string) => {
      const numbersOccurList: number[] = new Array<number>(text.length);

      numberLetters.forEach((number: string) => {
        const indexes = this.findWordIndices(text, number);
        indexes.length &&
          indexes.forEach(
            (i: number) =>
              (numbersOccurList[i] = this.WORD_WITH_NUMBER_MAP.get(
                number
              ) as number)
          );
      });

      const numbersList: number[] = numbersOccurList.filter(Number);
      sum +=
        numbersList.length === 1
          ? +(numbersList[0] + '' + numbersList[0])
          : +(numbersList[0] + '' + numbersList[numbersList.length - 1]);
    });

    return sum;
  }

  private findWordIndices(text: string, word: string) {
    const indices: number[] = [];
    let currentIndex: number = text.indexOf(word);

    while (currentIndex !== -1) {
      indices.push(currentIndex);
      currentIndex = text.indexOf(word, currentIndex + 1);
    }
    return indices;
  }

  private getSumOfFirstAndLastDigit(calibrationValues: string[]): number {
    const calibratedNumbers: number[] = calibrationValues
      .map((value: string) => value.replace(/\D/g, '').split(''))
      .map((chars: string[]) => {
        return +(chars[0] + '' + chars[chars.length - 1]);
      });

    return calibratedNumbers.reduce(
      (prev: number, curr: number) => prev + curr
    );
  }
}
