import { Component, OnInit } from '@angular/core';
import { TemperatureUnit } from 'src/app/shared/models/TemperatureUnit.model';
import { HeatIndexService } from 'src/app/features/heat-index/heat-index.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ResultHistoryItem } from 'src/app/shared/models/ResultHistoryItem.model';
import { ResultHistoryService } from './result-history.service';

@Component({
  selector: 'app-heat-index',
  templateUrl: './heat-index.component.html',
  styleUrls: ['./heat-index.component.scss'],
})
export class HeatIndexComponent implements OnInit {
  temperatureUnits: TemperatureUnit[];
  heatIndexForm: FormGroup;
  result: number;
  resultComment: string;
  resultTemperatureUnit: TemperatureUnit;
  resultHistory: ResultHistoryItem[] = [];

  constructor(
    private heatIndexService: HeatIndexService,
    private resultHistoryService: ResultHistoryService
  ) {}

  ngOnInit(): void {
    this.temperatureUnits = [
      new TemperatureUnit('Celsius', 'C'),
      new TemperatureUnit('Fahreheit', 'F'),
    ];

    this.heatIndexForm = new FormGroup({
      temperature: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^-?[0-9]\d*(\.\d+)?$/),
      ]),
      humidity: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(/^-?[0-9]\d*(\.\d+)?$/),
      ]),
      temperatureUnit: new FormControl(new TemperatureUnit('Celsius', 'C')),
    });
    this.heatIndexForm.controls['temperature'].addValidators(
      this.heatIndexService.getTemperatureAndUnitValidator(this.temperatureUnit)
    );
    this.heatIndexForm.controls['temperatureUnit'].valueChanges.subscribe(
      () => {
        this.heatIndexForm.controls['temperature'].updateValueAndValidity();
      }
    );
    this.resultHistory = this.resultHistoryService.loadResultsHistory();
  }

  get temperatureUnit(): AbstractControl {
    return this.heatIndexForm.controls['temperatureUnit'];
  }

  private get temperatureValue(): number {
    return this.heatIndexForm.controls['temperature'].value;
  }

  private get humidityValue(): number {
    return this.heatIndexForm.controls['humidity'].value;
  }

  onCalculateButtonClick(): void {
    if (this.heatIndexForm.invalid) {
      this.heatIndexForm.controls['temperature'].markAsDirty();
      this.heatIndexForm.controls['humidity'].markAsDirty();
      return;
    }
    this.result = null;
    this.resultTemperatureUnit = this.temperatureUnit.value;
    this.result = this.heatIndexService.calculateHeatIndex(
      this.temperatureValue,
      this.humidityValue,
      this.resultTemperatureUnit.code
    );
    this.resultComment = this.heatIndexService.determineComment(
      this.result,
      this.resultTemperatureUnit.code
    );
    this.resultHistoryService.saveResultInLocalStorage(
      this.result,
      this.temperatureUnit.value.code,
      this.resultHistory
    );
  }
}
