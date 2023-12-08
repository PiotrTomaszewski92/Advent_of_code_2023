import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { LoadDataService } from '../app/load-data/load-data.service';
import { Subscription } from 'rxjs';

type CubesGame = {
  record: number;
  colors: Map<string, number>[];
};

@Component({
  standalone: true,
  selector: 'aoc-day2',
  imports: [CommonModule, HttpClientModule],
  providers: [LoadDataService],
  templateUrl: './day2.component.html',
})
export class Day2Component implements OnDestroy {
  private readonly DAY_2_FILE_NAME: string = 'day2.txt';

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
      .loadData(this.DAY_2_FILE_NAME)
      .subscribe((games: string[]) => {
        const convertedData: CubesGame[] = this.convertInputData(games);
        this.firstSolution = this.solveFirstProblemWith(convertedData);
      });
  }

  public onLoadSecondSolution(): void {
    this.secondSubscription = this.loadDataService
      .loadData(this.DAY_2_FILE_NAME)
      .subscribe((games: string[]) => {
        const convertedData: CubesGame[] = this.convertInputData(games);
        this.secondSolution = this.solveSecondProblemWith(convertedData);
      });
  }

  private solveFirstProblemWith(games: CubesGame[]): number {
    let result = 0;

    const maxValuesOfColors: Map<string, number> = new Map<string, number>([
      ['red', 12],
      ['green', 13],
      ['blue', 14],
    ]);

    games.forEach((game: CubesGame) => {
      let success = true;
      const gameNumber: number = game.record;

      game.colors.forEach((colorsMap: Map<string, number>) => {
        ['red', 'blue', 'green'].forEach((color: string) => {
          if (
            colorsMap.get(color) &&
            (colorsMap.get(color) as number) >
              (maxValuesOfColors.get(color) as number)
          ) {
            success = false;
          }
        });
      });

      result += success && gameNumber;
    });

    return result;
  }

  private solveSecondProblemWith(games: CubesGame[]): number {
    let sum: number = 0;

    games.forEach((cubeGame: CubesGame) => {
      let fewestRed: number = 0;
      let fewestBlue: number = 0;
      let fewestGreen: number = 0;

      cubeGame.colors.forEach((colorsMap: Map<string, number>) => {
        fewestRed =
          (colorsMap.get('red') as number) > fewestRed
            ? (colorsMap.get('red') as number)
            : fewestRed;

        fewestBlue =
          (colorsMap.get('blue') as number) > fewestBlue
            ? (colorsMap.get('blue') as number)
            : fewestBlue;

        fewestGreen =
          (colorsMap.get('green') as number) > fewestGreen
            ? (colorsMap.get('green') as number)
            : fewestGreen;
      });

      sum += fewestRed * fewestBlue * fewestGreen;
    });

    return sum;
  }

  private convertInputData(games: string[]): CubesGame[] {
    const cubeGames: CubesGame[] = games.map((game: string) => {
      const splitList: string[] = game.split(':');
      return {
        record: +splitList[0].split('Game ')[1],
        colors: splitList[1]
          .split(';')
          .map((hands: string) => hands.trim())
          .map((hands: string) => {
            const tempMap: Map<string, number> = new Map<string, number>();
            hands.split(',').forEach((splitHands: string) => {
              const [count, color]: string[] = splitHands.trim().split(' ');
              tempMap.set(color, +count);
            });
            return tempMap;
          }),
      };
    });

    return cubeGames;
  }
}
