import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeatIndexComponent } from 'src/app/features/heat-index/heat-index.component';

const routes: Routes = [{ path: '', component: HeatIndexComponent }];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class HeatIndexModule {}
