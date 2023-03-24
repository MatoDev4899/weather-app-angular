export class Dataset {
  constructor(
    public label: string,
    public data: number[],
    public fill: boolean,
    public borderColor: string,
    public tension: number,
    public hidden?: boolean
  ) {}
}
