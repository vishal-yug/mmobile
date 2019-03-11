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
require_once($CFG->libdir . "/moodlelib.php");

class local_set_user_pin extends external_api {

  /**
   * Returns description of method parameters
   *
   * @return external_function_parameters
   * @since Moodle 2.3
   */
  public static function set_user_pin_parameters() {
    return new external_function_parameters(
        array(
      'pin' => new external_value(PARAM_ALPHANUM, 'pf number of the employee'),
        )
    );
  }

  /**
   * Verify the Mobile number
   *
   * Function throw an exception at the first error encountered.
   * @param $pin to enter in the database
   */
  public static function set_user_pin($pin) {
    global $DB, $CFG, $USER;
    $result = array();
    $result['status'] = false;
    $arrayparams = array(
      'pin' => $pin,
    );
    $params = self::validate_parameters(self::set_user_pin_parameters(), $arrayparams);
    $pin = hash_internal_user_password($params['pin']);
    $dataobj = new stdClass();
    $dataobj->id = $USER->id;
    $dataobj->pin = $pin;
    if($DB->update_record('user',$dataobj)){
    $result['status'] = true;
    }
    return $result;
  }

  /**
   * Returns description of method result value
   *
   * @return Status to show the user
   */
  public static function set_user_pin_returns() {
    return new external_single_structure(
        array(
      'status' => new external_value(PARAM_BOOL, 'status, true if success'),
        )
    );
  }

}
