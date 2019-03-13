// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { CoreAppProvider } from '@providers/app';
import { CoreEventsProvider } from '@providers/events';
import { CoreSitesProvider } from '@providers/sites';
// import { CoreSite } from '@classes/site';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreLoginHelperProvider } from '../../providers/helper';
import { CoreContentLinksDelegate } from '@core/contentlinks/providers/delegate';
import { CoreContentLinksHelperProvider } from '@core/contentlinks/providers/helper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CoreConstants } from '@core/constants';
/**
 * Generated class for the OtploginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'page-otplogin' })
@Component({
  selector: 'page-otplogin',
  templateUrl: 'otplogin.html',
})
export class OtploginPage {
  
  countries:any = [
    { code: '+91'}, { code: '+880'}, { code: '+32'}, { code: '+226'},  { code: '+359'}, { code: '+387'}, 
    { code: '+1-246'}, { code: '+681'}, { code: '+590'}, { code: '+1-441'},  { code: '+673'}, { code: '+591'}, 
    { code: '+973'}, { code: '+257'}, { code: '+229'}, { code: '+975'},  { code: '+1-876'}, { code: '+267'}, 
    { code: '+685'}, { code: '+599'}, { code: '+55'}, { code: '+1-242'},  { code: '+44-1534'}, { code: '+375'},
    { code: '+501'}, { code: '+7'}, { code: '+250'}, { code: '+381'},  { code: '+670'}, { code: '+262'}, 
    { code: '+993'}, { code: '+992'}, { code: '+40'}, { code: '+690'},  { code: '+245'}, { code: '+1-671'}, 
    { code: '+502'}, { code: '+30'}, { code: '+240'}, { code: '+590'},  { code: '+81'}, { code: '+592'}, 
    { code: '+44-1481'}, { code: '+594'}, { code: '+995'}, { code: '+1-473'},  { code: '+44'}, { code: '+241'},
    { code: '+503'}, { code: '+224'}, { code: '+220'}, { code: '+299'},  { code: '+350'}, { code: '+233'}, 
    { code: '+968'}, { code: '+216'}, { code: '+962'}, { code: '+385'},  { code: '+509'}, { code: '+36'}, 
    { code: '+852'}, { code: '+504'}, { code: '+58'}, { code: '+1-787'},  { code: '+1-939'}, { code: '+970'}, 
    { code: '+680'}, { code: '+351'}, { code: '+47'}, { code: '+595'},  { code: '+964'}, { code: '+507'}, 
    { code: '+689'}, { code: '+675'}, { code: '+51'}, { code: '+92'},  { code: '+63'}, { code: '+870'}, 
    { code: '+48'}, { code: '+508'}, { code: '+260'}, { code: '+212'},  { code: '+372'}, { code: '+20'}, 
    { code: '+27'}, { code: '+593'}, { code: '+39'}, { code: '+84'},  { code: '+677'}, { code: '+251'}, 
    { code: '+252'}, { code: '+263'}, { code: '+39'}, { code: '+966'},  { code: '+34'}, { code: '+291'}, 
    { code: '+382'}, { code: '+373'}, { code: '+261'}, { code: '+590'},  { code: '+212'}, { code: '+377'}, 
    { code: '+998'}, { code: '+95'}, { code: '+223'}, { code: '+853'},  { code: '+976'}, { code: '+389'}, 
    { code: '+230'}, { code: '+356'}, { code: '+265'}, { code: '+960'},  { code: '+596'}, { code: '+1-670'}, 
    { code: '+1-664'}, { code: '+222'}, { code: '+44-1624'}, { code: '+960'},  { code: '+256'}, { code: '+255'}, 
    { code: '+60'}, { code: '+52'}, { code: '+972'}, { code: '+33'},  { code: '+246'}, { code: '+290'}, 
    { code: '+358'}, { code: '+679'}, { code: '+500'}, { code: '+691'},  { code: '+298'}, { code: '+505'}, 
    { code: '+31'}, { code: '+47'}, { code: '+264'}, { code: '+678'},  { code: '+687'}, { code: '+227'}, 
    { code: '+672'}, { code: '+234'}, { code: '+64'}, { code: '+977'},  { code: '+674'}, { code: '+683'}, 
    { code: '+662'}, { code: '+383'}, { code: '+225'}, { code: '+41'},  { code: '+57'}, { code: '+86'},
    { code: '+237'}, { code: '+56'}, { code: '+61'}, { code: '+1'},  { code: '+242'}, { code: '+236'}, 
    { code: '+243'}, { code: '+420'}, { code: '+357'}, { code: '+506'},  { code: '+599'}, { code: '+238'}, 
    { code: '+53'}, { code: '+268'}, { code: '+963'}, { code: '+269'},  { code: '+996'}, { code: '+254'}, 
    { code: '+211'}, { code: '+597'}, { code: '+686'}, { code: '+855'},  { code: '+1-869'}, { code: '+269'}, 
    { code: '+239'}, { code: '+421'}, { code: '+82'}, { code: '+386'},  { code: '+850'}, { code: '+965'}, 
    { code: '+221'}, { code: '+378'}, { code: '+232'}, { code: '+248'},  { code: '+7'}, { code: '+1-345'}, 
    { code: '+65'}, { code: '+46'}, { code: '+1-809'}, { code: '+249'},  { code: '+1-829'}, { code: '+1-767'}, 
    { code: '+253'}, { code: '+45'}, { code: '+1-284'}, { code: '+49'},  { code: '+967'}, { code: '+213'}, 
    { code: '+598'}, { code: '+262'}, { code: '+961'}, { code: '+1-758'},  { code: '+856'}, { code: '+688'}, 
    { code: '+886'}, { code: '+1-868'}, { code: '+961'}, { code: '+90'},  { code: '+94'}, { code: '+423'}, 
    { code: '+352'}, { code: '+231'}, { code: '+266'}, { code: '+66'},  { code: '+228'}, { code: '+235'}, 
    { code: '+1-649'}, { code: '+218'}, { code: '+379'}, { code: '+1-784'},  { code: '+971'}, { code: '+376'}, 
    { code: '+1-268'}, { code: '+93'}, { code: '+1-264'}, { code: '+1-340'},  { code: '+354'}, { code: '+98'}, 
    { code: '+374'}, { code: '+355'}, { code: '+244'}, { code: '+672'},  { code: '+1-684'}, { code: '+54'}, 
    { code: '+61'}, { code: '+43'}, { code: '+297'}, { code: '+358-18'},  { code: '+994'}, { code: '+353'}, 
    { code: '+62'}, { code: '+380'}, { code: '+974'}, { code: '+258'}
  ];
  
  country: string;  
  credForm: FormGroup;
  siteUrl: string;
  siteChecked = false;
  siteName: string;
  logoUrl: string;
  authInstructions: string;
  canSignup: boolean;
  identityProviders: any[];

  pageLoaded = false;
  isBrowserSSO = false;
  isFixedUrlSet = false;
  
  protected siteConfig;
  protected eventThrown = false;
  protected viewLeft = false;
  protected siteId: string;
  protected urlToOpen: string;

  constructor(private navCtrl: NavController, navParams: NavParams, fb: FormBuilder, private appProvider: CoreAppProvider,
    private sitesProvider: CoreSitesProvider, private loginHelper: CoreLoginHelperProvider,
    private domUtils: CoreDomUtilsProvider, private translate: TranslateService, private utils: CoreUtilsProvider,
    private eventsProvider: CoreEventsProvider, private contentLinksDelegate: CoreContentLinksDelegate,
    private contentLinksHelper: CoreContentLinksHelperProvider, private http: HttpClient) {

    this.siteUrl = navParams.get('siteUrl');
    this.siteConfig = navParams.get('siteConfig');
    this.urlToOpen = navParams.get('urlToOpen');
    this.country = "+91";

    this.credForm = fb.group({
      pfnumber: [navParams.get('pfnumber') || '', Validators.required],
      phone_number: ['', Validators.required],
      country: ['', Validators.required]
    });

  }

  /**
   * View loaded.
   */
  ionViewDidLoad(): void {
    this.treatSiteConfig();
    this.isFixedUrlSet = this.loginHelper.isFixedUrlSet();

    if (this.isFixedUrlSet) {
      // Fixed URL, we need to check if it uses browser SSO login.
      this.checkSite(this.siteUrl);
    } else {
      this.siteChecked = true;
      this.pageLoaded = true;
    }
  }

  /**
   * View left.
   */
  ionViewDidLeave(): void {
    this.viewLeft = true;
    this.eventsProvider.trigger(CoreEventsProvider.LOGIN_SITE_UNCHECKED, { config: this.siteConfig }, this.siteId);
  }

  /**
   * Check if a site uses local_mobile, requires SSO login, etc.
   * This should be used only if a fixed URL is set, otherwise this check is already performed in CoreLoginSitePage.
   *
   * @param {string} siteUrl Site URL to check.
   * @return {Promise<any>} Promise resolved when done.
   */
  protected checkSite(siteUrl: string): Promise<any> {
    this.pageLoaded = false;

    // If the site is configured with http:// protocol we force that one, otherwise we use default mode.
    const protocol = siteUrl.indexOf('http://') === 0 ? 'http://' : undefined;

    return this.sitesProvider.checkSite(siteUrl, protocol).then((result) => {

      this.siteChecked = true;
      this.siteUrl = result.siteUrl;

      this.siteConfig = result.config;
      this.treatSiteConfig();

      if (result && result.warning) {
        this.domUtils.showErrorModal(result.warning, true, 4000);
      }

      if (this.loginHelper.isSSOLoginNeeded(result.code)) {
        // SSO. User needs to authenticate in a browser.
        this.isBrowserSSO = true;

        // Check that there's no SSO authentication ongoing and the view hasn't changed.
        if (!this.appProvider.isSSOAuthenticationOngoing() && !this.viewLeft) {
          this.loginHelper.confirmAndOpenBrowserForSSOLogin(
            result.siteUrl, result.code, result.service, result.config && result.config.launchurl);
        }
      } else {
        this.isBrowserSSO = false;
      }

    }).catch((error) => {
      this.domUtils.showErrorModal(error);
    }).finally(() => {
      this.pageLoaded = true;
    });
  }

  /**
   * Treat the site configuration (if it exists).
   */
  protected treatSiteConfig(): void {
    if (this.siteConfig) {
      this.siteName = this.siteConfig.sitename;
      this.logoUrl = this.siteConfig.logourl || this.siteConfig.compactlogourl;
      this.authInstructions = this.siteConfig.authinstructions || this.translate.instant('core.login.loginsteps');
      this.canSignup = this.siteConfig.registerauth == 'email' && !this.loginHelper.isEmailSignupDisabled(this.siteConfig);
      this.identityProviders = this.loginHelper.getValidIdentityProviders(this.siteConfig);

      if (!this.eventThrown && !this.viewLeft) {
        this.eventThrown = true;
        this.eventsProvider.trigger(CoreEventsProvider.LOGIN_SITE_CHECKED, { config: this.siteConfig });
      }
    } else {
      this.siteName = null;
      this.logoUrl = null;
      this.authInstructions = null;
      this.canSignup = false;
      this.identityProviders = [];
    }
  }

  /**
   * Tries to authenticate the user.
   *
   * @param {Event} [e] Event.
   */
  SendOTP(e?: Event): Promise<void> {

    // Get input data.
    const siteUrl = this.siteUrl,
      pfnumber = this.credForm.value.pfnumber,
      phone_number = this.credForm.value.phone_number,
      country = this.credForm.value.country;


    if (!pfnumber) {
      this.domUtils.showErrorModal('PF Number Required', true);

      return;
    }
    if (!phone_number) {
      this.domUtils.showErrorModal('Required your Phone Number', true);

      return;
    }

    const params = {
      pfnumber: pfnumber,
      phone_number: country + ',' +phone_number
    };
    
    const modal = this.domUtils.showModalLoading();

    const promise = this.http.post(siteUrl + '/local/pin_authentication/pf-mobile-auth.php', params).timeout(CoreConstants.WS_TIMEOUT).toPromise();
    
    return promise.catch(() => {
      return Promise.reject({error: this.translate.instant('core.cannotconnect')});
    }).then((data: any) => {

      if (typeof data == 'undefined') {
        return Promise.reject(this.translate.instant('core.cannotconnect'));
      } else if (typeof data.success != 'undefined' && !data.success) {
         this.domUtils.showErrorModal(data.error_message);
      } else {
        this.navCtrl.push('OtpscreenPage', { siteUrl: this.siteUrl, siteConfig: this.siteConfig, phone_number: phone_number, pfnumber: pfnumber, country: country });
      }
    }).finally(() => {
      modal.dismiss();
    });
 
  }

}

