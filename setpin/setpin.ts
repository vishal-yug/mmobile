import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { CoreAppProvider } from '@providers/app';
import { CoreEventsProvider } from '@providers/events';
import { CoreSitesProvider } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreLoginHelperProvider } from '../../providers/helper';
import { CoreConfigConstants } from '../../../../configconstants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the SetpinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setpin',
  templateUrl: 'setpin.html',
})
export class SetpinPage {

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

  constructor(private navCtrl: NavController, fb: FormBuilder, private appProvider: CoreAppProvider,
    private sitesProvider: CoreSitesProvider, private loginHelper: CoreLoginHelperProvider,
    private domUtils: CoreDomUtilsProvider, private translate: TranslateService, 
    private eventsProvider: CoreEventsProvider) {

    this.credForm = fb.group({
      setpin: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      confirmpin: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
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

    siteUrl = CoreConfigConstants.siteurl;
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
   * Set the Pin of the user of his own choice.
   *
   */
  SetPIN(){

    const pin = this.credForm.value.setpin,
      confirmpin = this.credForm.value.confirmpin;

    if ((pin != confirmpin)) {
      this.domUtils.showErrorModal("Confirm PIN doesn't match with the PIN you enter", true);

      return;
    }
    var siteid = this.sitesProvider.getCurrentSiteId();

    this.sitesProvider.getSite(siteid).then((site) => {
      const params = {
        pin: pin
      };
      return site.write('set_user_pin', params).then((data) => {
      if (data.status) {
        this.navCtrl.push('CoreMainMenuPage');
                } else{
        this.domUtils.showErrorModal("There is an issue while setting up the PIN please try again after some time", true);
                }
      }).catch(() => {
        // Unable to get mime type, assume it's not supported.
      })
    });


  }

}
