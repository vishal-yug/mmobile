import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtploginPage } from './Otplogin';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    OtploginPage,
  ],
  imports: [
      CoreComponentsModule,
    CoreDirectivesModule,
    IonicPageModule.forChild(OtploginPage),
    TranslateModule.forChild()
  ],
})
export class OtploginPageModule {}
