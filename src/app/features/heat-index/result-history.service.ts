import { Injectable } from '@angular/core';
import { ResultHistoryItem } from 'src/app/shared/models/ResultHistoryItem.model';
import { HeatIndexService } from './heat-index.service';

@Injectable({
  providedIn: 'root',
})
export class ResultHistoryService {
  constructor(private heatIndexService: HeatIndexService) {}

  loadResultsHistory(): ResultHistoryItem[] {
    const resultHistory = JSON.parse(localStorage.getItem('result')) || [];
    return resultHistory.map(
      (item: ResultHistoryItem) =>
        new ResultHistoryItem(
          item.result,
          item.temperatureUnit,
          this.heatIndexService.determineComment(
            item.result,
            item.temperatureUnit
          )
        )
    );
  }

  saveResultInLocalStorage(
    result: number,
    unit: string,
    historyResults: ResultHistoryItem[]
  ): void {
    // Check if result is the same as last one
    if (
      historyResults.length === 0 ||
      historyResults.slice(-1)[0].result !== result
    ) {
      historyResults.push(
        new ResultHistoryItem(
          result,
          unit,
          this.heatIndexService.determineComment(result, unit)
        )
      );
      // Remove oldest result if more than 3 results
      if (historyResults.length > 3) {
        historyResults.shift();
      }

      const resultsToSave: ResultHistoryItem[] = historyResults.map(
        (historyResult: ResultHistoryItem) => {
          return new ResultHistoryItem(
            historyResult.result,
            historyResult.temperatureUnit
          );
        }
      );
      localStorage.setItem('result', JSON.stringify(resultsToSave));
    }
  }
}
