<?php

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


require_once($CFG->libdir . "/externallib.php");

class local_verify_mobile_send_otp extends external_api {

  /**
   * Returns description of method parameters
   *
   * @return external_function_parameters
   * @since Moodle 2.3
   */
  public static function verify_mobile_send_otp_parameters() {
    return new external_function_parameters(
        array(
      'pfnumber' => new external_value(PARAM_ALPHANUM, 'pf number of the employee'),
      'phone_number' => new external_value(PARAM_ALPHANUM, 'Mobile number of the user to verify in records and sent the OTP'),
        )
    );
  }

  /**
   * Verify the Mobile number
   *
   * Function throw an exception at the first error encountered.
   * @param $pfnumber of employee
   * @param mobile number of employee
   */
  public static function verify_mobile_send_otp($pfnumber, $phone_number) {
    global $DB, $CFG;
    $result = array();
    $result['status'] = false;
    $arrayparams = array(
      'pfnumber' => $pfnumber,
      'phone_number' => $phone_number,
    );
    $params = self::validate_parameters(self::verify_mobile_send_otp_parameters(), $arrayparams);
    $pfnumber = $params['pfnumber'];
    $phone_number = $params['phone_number'];
    $user = $DB->get_record('user', array('idnumber' => $pfnumber), '*', null);
    if (empty($user)) {  //IF user record not found
      $message = 'No user is find in records with this PF Number';
    }
    else if (empty($user->phone2)) {  //if phone number is not there with the record
      $message = 'Phone Number does not exist for this user';
    }
    else if ($user->phone2 != $phone_number) { //if provided number doesn't match with the existing mumber
      $message = 'Phone number you have provided is not matched with the existing record';
    }

    else if ($user->phone2 == $phone_number) { //if number match with the existing number
      $result['status'] = true;
      $message = "Please Enter the OTP send to your given number";
    }

    $result['message'] = $message;
    return $result;
  }

  /**
   * Returns description of method result value
   *
   * @return Status and message to show the user
   */
  public static function verify_mobile_send_otp_returns() {
    return new external_single_structure(
        array(
      'status' => new external_value(PARAM_BOOL, 'status, true if success'),
      'message' => new external_value(PARAM_TEXT, 'message to send for the user'),
        )
    );
  }

}
