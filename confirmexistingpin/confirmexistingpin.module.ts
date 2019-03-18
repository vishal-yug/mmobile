import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmexistingpinPage } from './Confirmexistingpin';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    ConfirmexistingpinPage,
  ],
  imports: [
    CoreComponentsModule,
    CoreDirectivesModule,
    IonicPageModule.forChild(ConfirmexistingpinPage),
    TranslateModule.forChild()
  ],
})
export class ConfirmexistingpinPageModule {}
