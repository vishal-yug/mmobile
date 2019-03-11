import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetpinPage } from './setpin';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    SetpinPage,
  ],
  imports: [
    CoreComponentsModule,
    CoreDirectivesModule,
    IonicPageModule.forChild(SetpinPage),
    TranslateModule.forChild()
  ],
})
export class SetpinPageModule {}
