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
      'pin' => new external_value(PARAM_ALPHANUM, 'new pin of set by the user'),
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
    if ($DB->update_record('user', $dataobj)) {
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

  /**
   * Returns description of method parameters
   *
   * @return external_function_parameters
   * @since Moodle 2.3
   */
  public static function check_user_current_pin_parameters() {
    return new external_function_parameters(
        array(
      'currentpin' => new external_value(PARAM_ALPHANUM, 'check the existing pin of the user'),
        )
    );
  }

  /**
   * Check the current pin of the user
   *
   * Function throw an exception at the first error encountered.
   * @param $pin to enter in the database
   */
  public static function check_user_current_pin($currentpin) {
    global $DB, $CFG, $USER;
    $result = array();
    $result['status'] = false;
    $arrayparams = array(
      'currentpin' => $currentpin,
    );
    $params = self::validate_parameters(self::check_user_current_pin_parameters(), $arrayparams);
    $user = $DB->get_record('user', array('id' => $USER->id));
    $valid_user = self::validate_internal_user_pin($user, $params['currentpin']);
    if ($valid_user) {
      $result['status'] = true;
    }
    return $result;
  }

  /**
   * Returns description of method result value
   *
   * @return Status to show the user
   */
  public static function check_user_current_pin_returns() {
    return new external_single_structure(
        array(
      'status' => new external_value(PARAM_BOOL, 'status, true if success'),
        )
    );
  }

  public function validate_internal_user_pin($user, $pin) {
    global $CFG;

    // If hash isn't a legacy (md5) hash, validate using the library function.
    if (!password_is_legacy_hash($user->pin)) {
      return password_verify($pin, $user->pin);
    }

    // Otherwise we need to check for a legacy (md5) hash instead. If the hash
    // is valid we can then update it to the new algorithm.

    $sitesalt = isset($CFG->passwordsaltmain) ? $CFG->passwordsaltmain : '';
    $validated = false;

    if ($user->pin === md5($pin . $sitesalt)
        or $user->pin === md5($pin)
        or $user->pin === md5(addslashes($pin) . $sitesalt)
        or $user->pin === md5(addslashes($pin))) {
      // Note: we are intentionally using the addslashes() here because we
      //       need to accept old password hashes of passwords with magic quotes.
      $validated = true;
    }
    else {
      for ($i = 1; $i <= 20; $i++) { // 20 alternative salts should be enough, right?
        $alt = 'passwordsaltalt' . $i;
        if (!empty($CFG->$alt)) {
          if ($user->pin === md5($pin . $CFG->$alt) or $user->pin === md5(addslashes($pin) . $CFG->$alt)) {
            $validated = true;
            break;
          }
        }
      }
    }

    return $validated;
  }

}
