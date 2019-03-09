import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtpscreenPage } from './Otpscreen';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    OtpscreenPage,
  ],
  imports: [
    CoreComponentsModule,
    CoreDirectivesModule,
    IonicPageModule.forChild(OtpscreenPage),
    TranslateModule.forChild()
  ],
})
export class OtpscreenPageModule {}
