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

/**
 * Return token
 * @package    moodlecore
 * @copyright  2011 Dongsheng Cai <dongsheng@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define('AJAX_SCRIPT', true);
define('REQUIRE_CORRECT_ACCESS', true);
define('NO_MOODLE_COOKIES', true);

require_once(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/externallib.php');
require_once('lib.php');
// Allow CORS requests.
header('Access-Control-Allow-Origin: *');
global $DB, $CFG;

$pfnumber = required_param('pfnumber', PARAM_RAW);
$phone_number = required_param('phone_number', PARAM_RAW);

//Get user based on PF number
$user = $DB->get_record('user', array('idnumber' => $pfnumber), '*', null);

if (empty($user)) {
  $return = array('success' => false, 'error_message' => "Sorry, This PF number is not valid.");
  echo json_encode($return);
} else if ($user->phone2 != $phone_number) {
  $return = array('success' => false, 'error_message' => "Sorry, This phone number is not found with our system.");
  echo json_encode($return);
} else {
  // We have found our user, we can generate OTP and set to pin
  $otp = "123456";
  $sitesalt = isset($CFG->passwordsaltmain) ? $CFG->passwordsaltmain : '';

  $user->pin = password_hash($otp, PASSWORD_DEFAULT);
  $DB->update_record('user', $user);

  echo json_encode(array('success' => true, 'phone_number' => $phone_number));
}
