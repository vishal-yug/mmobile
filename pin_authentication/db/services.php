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


// We defined the web service functions to install.
$functions = array(
    'set_user_pin' => array(
    'classname' => 'local_set_user_pin',
    'methodname' => 'set_user_pin',
    'classpath' => 'local/pin_authentication/externallib.php',
    'description' => 'Set the user pin enter from the app',
    'type' => 'write',
    'services'     => array(MOODLE_OFFICIAL_MOBILE_SERVICE),
    ),
);
