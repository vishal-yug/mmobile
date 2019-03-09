<?php

require_once(__DIR__ . '/../../config.php');

function authenticate_user_login_pin($username, $pin, $ignorelockout = false, &$failurereason = null, $logintoken = false) {
  global $CFG, $DB;
  require_once("$CFG->libdir/authlib.php");

  if ($user = get_complete_user_data('username', $username, $CFG->mnet_localhost_id)) {
    // we have found the user
  }

  if (empty($user->id)) {
    $failurereason = AUTH_LOGIN_NOUSER;
    // Trigger login failed event.
    $event = \core\event\user_login_failed::create(array('other' => array('username' => $username,
            'reason' => $failurereason)));
    $event->trigger();
    return false;
  }

  if (!empty($user->suspended)) {
    // Just in case some auth plugin suspended account.
    $failurereason = AUTH_LOGIN_SUSPENDED;
    // Trigger login failed event.
    $event = \core\event\user_login_failed::create(array('userid' => $user->id,
          'other' => array('username' => $username, 'reason' => $failurereason)));
    $event->trigger();
    error_log('[client ' . getremoteaddr() . "]  $CFG->wwwroot  Suspended Login:  $username  " . $_SERVER['HTTP_USER_AGENT']);
    return false;
  }

  if (!(user_login_pin($username, $pin))) {
    return false;
  }else {
    login_attempt_valid($user);
    $failurereason = AUTH_LOGIN_OK;
    return $user;
  }

  // Failed if all the plugins have failed.
  if (debugging('', DEBUG_ALL)) {
    error_log('[client ' . getremoteaddr() . "]  $CFG->wwwroot  Failed Login:  $username  " . $_SERVER['HTTP_USER_AGENT']);
  }

  if ($user->id) {
    login_attempt_failed($user);
    $failurereason = AUTH_LOGIN_FAILED;
    // Trigger login failed event.
    $event = \core\event\user_login_failed::create(array('userid' => $user->id,
          'other' => array('username' => $username, 'reason' => $failurereason)));
    $event->trigger();
  }
  else {
    $failurereason = AUTH_LOGIN_NOUSER;
    // Trigger login failed event.
    $event = \core\event\user_login_failed::create(array('other' => array('username' => $username,
            'reason' => $failurereason)));
    $event->trigger();
  }

  return false;
}

function user_login_pin($username, $pin) {
  global $CFG, $DB, $USER;
  if (!$user = $DB->get_record('user', array('username' => $username, 'mnethostid' => $CFG->mnet_localhost_id))) {
    return false;
  }
  if (!validate_internal_user_pin($user, $pin)) {
    return false;
  }
  return true;
}

function validate_internal_user_pin($user, $pin) {
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
