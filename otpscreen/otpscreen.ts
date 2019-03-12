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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the OtploginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'page-otpscreen' })
@Component({
  selector: 'page-otpscreen',
  templateUrl: 'otpscreen.html',
})
export class OtpscreenPage {
  credForm: FormGroup;
  siteUrl: string;
  pfnumber: string;
  phone_number: string;
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
    private contentLinksHelper: CoreContentLinksHelperProvider) {

    this.siteUrl = navParams.get('siteUrl');
    this.siteConfig = navParams.get('siteConfig');
    this.urlToOpen = navParams.get('urlToOpen');
    this.pfnumber = navParams.get('pfnumber');
    this.phone_number = navParams.get('phone_number');

    this.credForm = fb.group({
      otp: ['', Validators.required]
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
  LoginUsingOTP(e?: Event): Promise<void> {

    // Get input data.
    const siteUrl = this.siteUrl,
      otp = this.credForm.value.otp;

    if (!otp) {
      this.domUtils.showErrorModal('OTP is required', true);
      return;
    }
   
    if (otp.length != 6) {
      this.domUtils.showErrorModal('Invalid OTP, please try again.', true);
      return;      
    }

    const modal = this.domUtils.showModalLoading();

    // Start the authentication process.
    this.sitesProvider.getUserTokenFromPin(siteUrl, this.pfnumber, otp, true).then((data) => {
        return this.sitesProvider.newSite(data.siteUrl, data.token, data.privateToken).then((id) => {
            this.credForm.controls['otp'].reset();
            this.siteId = id;

            if (this.urlToOpen) {
                // There's a content link to open.
                return this.contentLinksDelegate.getActionsFor(this.urlToOpen, undefined, this.pfnumber).then((actions) => {
                    const action = this.contentLinksHelper.getFirstValidAction(actions);
                    if (action && action.sites.length) {
                        // Action should only have 1 site because we're filtering by username.
                        action.action(action.sites[0]);
                    } else {
                        return this.loginHelper.goToSiteInitialPage();
                    }
                });
            } else {
                return this.loginHelper.goToSiteInitialPage();
            }
        });
    }).catch((error) => {
// tslint:disable-next-line: no-console
        console.log(error);
        this.loginHelper.treatUserTokenError(siteUrl, error, this.pfnumber, otp);
    }).finally(() => {
        modal.dismiss();
    });
  }
}

