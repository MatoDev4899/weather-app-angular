import { Dataset } from './Dataset.model';

export class ChartData {
  constructor(public labels: string[], public datasets: Dataset[]) {}
}
