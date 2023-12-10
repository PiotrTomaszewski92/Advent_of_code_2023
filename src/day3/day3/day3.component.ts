import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { LoadDataService } from '../../app/load-data/load-data.service';
import { Subscription } from 'rxjs';

type SymbolPosition = {
  rowIndex: number;
  columnIndex: number;
  element: string;
};

type NumberPosition = {
  value: number;
  rowIndex: number;
  columnIndex: number;
  endColumnIndex: number;
};

@Component({
  standalone: true,
  selector: 'aoc-day3',
  imports: [CommonModule, HttpClientModule],
  providers: [LoadDataService],
  templateUrl: './day3.component.html',
})
export class Day3Component implements OnDestroy {
  private readonly DAY_3_FILE_NAME: string = 'day3.txt';

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
      .loadData(this.DAY_3_FILE_NAME)
      .subscribe((data: string[]) => {
        this.firstSolution = this.solveFirstProblemWith(data);
      });
  }

  public onLoadSecondSolution(): void {
    this.secondSubscription = this.loadDataService
      .loadData(this.DAY_3_FILE_NAME)
      .subscribe((data: string[]) => {
        this.secondSolution = this.solveSecondProblemWith(data);
      });
  }

  private solveFirstProblemWith(data: string[]): number {
    const findedValues: number[] = [];
    const symbolsPositions = this.getSymbolsPositions(data);
    let numbersPositions: NumberPosition[];

    data.forEach((row: string, rowIndex: number) => {
      numbersPositions = this.getNumbersPositions(row, rowIndex);

      numbersPositions.forEach((number: NumberPosition) => {
        const findedSymbols: SymbolPosition[] = this.findSymbolAroundNumber(
          symbolsPositions,
          rowIndex,
          number.columnIndex - 1,
          number.columnIndex + number.value.toString().length
        );

        findedSymbols.length !== 0 && findedValues.push(number.value);
      });
    });

    return this.sumElements(findedValues);
  }

  private solveSecondProblemWith(data: string[]): number {
    const multipliedValues: number[] = [];
    const symbolsPositions = this.getSymbolsPositions(data);
    let numbersPositions: NumberPosition[] = [];

    data.forEach((row, rowIndex) => {
      numbersPositions = [
        ...this.getNumbersPositions(row, rowIndex),
        ...numbersPositions,
      ];
    });

    symbolsPositions.forEach((symbolPosition: SymbolPosition) => {
      if (symbolPosition.element === '*') {
        const findedNumbers: NumberPosition[] = this.findNumbersAroundSymbol(
          numbersPositions,
          symbolPosition.rowIndex,
          symbolPosition.columnIndex
        );

        findedNumbers.length === 2 &&
          multipliedValues.push(
            findedNumbers[0].value * findedNumbers[1].value
          );
      }
    });

    return this.sumElements(multipliedValues);
  }

  private getSymbolsPositions(rows: string[]): SymbolPosition[] {
    const symbolsPositions: SymbolPosition[] = [];
    rows.forEach((row: string, rowIndex: number) => {
      row.split('').forEach((columnElement: string, columnIndex: number) => {
        if (isNaN(+columnElement) && columnElement !== '.') {
          symbolsPositions.push({
            rowIndex,
            columnIndex,
            element: columnElement,
          });
        }
      });
    });
    return symbolsPositions;
  }

  private getNumbersPositions(row: string, rowIndex: number): NumberPosition[] {
    const regExp: RegExp = /\d+/g;
    const numbersPosition: NumberPosition[] = [];
    let matchedList: RegExpExecArray | null;

    while ((matchedList = regExp.exec(row)) !== null) {
      const number = matchedList[0];
      const position = matchedList.index;
      numbersPosition.push({
        value: parseInt(number),
        rowIndex,
        columnIndex: position,
        endColumnIndex: position + number.length - 1,
      });
    }

    return numbersPosition;
  }

  private findSymbolAroundNumber = (
    symbolsPositions: SymbolPosition[],
    rowIndex: number,
    numberStartIndex: number,
    numberEndIndex: number
  ): SymbolPosition[] => {
    return symbolsPositions.filter(
      (symbolPosition: SymbolPosition) =>
        symbolPosition.rowIndex >= rowIndex - 1 &&
        symbolPosition.rowIndex <= rowIndex + 1 &&
        symbolPosition.columnIndex >= numberStartIndex &&
        symbolPosition.columnIndex <= numberEndIndex
    );
  };

  private findNumbersAroundSymbol(
    numbersPositions: NumberPosition[],
    symbolRow: number,
    symbolPosition: number
  ): NumberPosition[] {
    return numbersPositions.filter(
      (numberPosition: NumberPosition) =>
        numberPosition.rowIndex >= symbolRow - 1 &&
        numberPosition.rowIndex <= symbolRow + 1 &&
        ((numberPosition.columnIndex >= symbolPosition - 1 &&
          numberPosition.columnIndex <= symbolPosition + 1) ||
          (numberPosition.endColumnIndex >= symbolPosition - 1 &&
            numberPosition.endColumnIndex <= symbolPosition + 1))
    );
  }

  private sumElements(findedNumbers: number[]): number {
    return findedNumbers.reduce(
      (first: number, second: number) => first + second,
      0
    );
  }
}

//first: 528799
//second: 84907174
