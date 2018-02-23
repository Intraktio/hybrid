import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../app/shared/shared.module';
import { ItemPage as Page } from './item';

@NgModule({
  declarations: [
    Page
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(Page)
  ],
  entryComponents: [
    Page
  ]
})
export class ItemPageModule {}
