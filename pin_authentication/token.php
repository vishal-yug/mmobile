<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

define('AJAX_SCRIPT', true);
define('REQUIRE_CORRECT_ACCESS', true);
define('NO_MOODLE_COOKIES', true);

require_once(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/externallib.php');
require_once('lib.php');
// Allow CORS requests.
header('Access-Control-Allow-Origin: *');
global $DB;

$pfnumber = required_param('pfnumber', PARAM_RAW);
$username = $DB->get_field('user', 'username', array('idnumber' => $pfnumber));
$pin = optional_param('pin', null, PARAM_RAW);
$otp = optional_param('otp', null, PARAM_RAW);
$serviceshortname = required_param('service', PARAM_ALPHANUMEXT);

echo $OUTPUT->header();

if (!$CFG->enablewebservices) {
  throw new moodle_exception('enablewsdescription', 'webservice');
}
$username = trim(core_text::strtolower($username));
if (is_restored_user($username)) {
  throw new moodle_exception('restoredaccountresetpassword', 'webservice');
}

$systemcontext = context_system::instance();
$pass = !empty($pin) ? $pin : $otp;
$reason = null;
$user = authenticate_user_login_pin($username, $pass, false, $reason, false);

if (!empty($user)) {

  // Cannot authenticate unless maintenance access is granted.
  $hasmaintenanceaccess = has_capability('moodle/site:maintenanceaccess', $systemcontext, $user);
  if (!empty($CFG->maintenance_enabled) and ! $hasmaintenanceaccess) {
    throw new moodle_exception('sitemaintenance', 'admin');
  }

  if (isguestuser($user)) {
    throw new moodle_exception('noguest');
  }
  if (empty($user->confirmed)) {
    throw new moodle_exception('usernotconfirmed', 'moodle', '', $user->username);
  }
  // let enrol plugins deal with new enrolments if necessary
  enrol_check_plugins($user);

  // setup user session to check capability
  \core\session\manager::set_user($user);

  //check if the service exists and is enabled
  $service = $DB->get_record('external_services', array('shortname' => $serviceshortname, 'enabled' => 1));
  if (empty($service)) {
    // will throw exception if no token found
    throw new moodle_exception('servicenotavailable', 'webservice');
  }

  // Get an existing token or create a new one.
  $token = external_generate_token_for_current_user($service);
  $privatetoken = $token->privatetoken;
  external_log_token_request($token);

  $siteadmin = has_capability('moodle/site:config', $systemcontext, $USER->id);

  $usertoken = new stdClass;
  $usertoken->token = $token->token;
  // Private token, only transmitted to https sites and non-admin users.
  if (is_https() and ! $siteadmin) {
    $usertoken->privatetoken = $privatetoken;
  }
  else {
    $usertoken->privatetoken = null;
  }
  echo json_encode($usertoken);
}
else {
  throw new moodle_exception('invalidlogin');
}
