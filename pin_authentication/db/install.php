<?php

defined('MOODLE_INTERNAL') || die;

function  xmldb_local_pin_authentication_install() {
    global $DB;

    $dbman = $DB->get_manager();

    // Define field newfield to be added to course.
    $table = new xmldb_table('user');
    $field = new xmldb_field('pin', XMLDB_TYPE_CHAR, '255', null, null, null, null, 'password');

    // Conditionally launch add field newfield.
    if (!$dbman->field_exists($table, $field)) {
        $dbman->add_field($table, $field);
    }
}