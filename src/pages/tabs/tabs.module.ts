import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage as Page } from './tabs';

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
export class TabsPageModule {}

