import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPage as Page } from './list';

@NgModule({
  declarations: [
    Page
  ],
  imports: [
    IonicPageModule.forChild(Page)
  ],
  entryComponents: [
    Page
  ]
})
export class ListPageModule {}

