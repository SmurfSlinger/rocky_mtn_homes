 <?php
$secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
session_set_cookie_params([
    'lifetime' => 0,              // expires on browser close
    'path' => '/',
    'domain' => '',               // set if you have subdomains to share session
    'secure' => $secure,          // true if HTTPS, else false
    'httponly' => true,           // disallow JS access to cookie
    'samesite' => 'Strict'        // prevent CSRF in most cases
]);
 session_start();
 $timeout_duration = 3600; // 60 minutes

if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY']) > $timeout_duration) {
    session_unset();
    session_destroy();
    session_start();
}

$_SESSION['LAST_ACTIVITY'] = time();

  define("PRIVATE_PATH", dirname(__FILE__));  // /path/to/rocky_mtn_homes/private/includes
define("PROJECT_PATH", dirname(dirname(PRIVATE_PATH))); // two levels up to /path/to/rocky_mtn_homes
define("PUBLIC_PATH", PROJECT_PATH . "/public");

  define("SHARED_PATH", PRIVATE_PATH);

$doc_root = $_SERVER['DOCUMENT_ROOT'];
$script_name = $_SERVER['SCRIPT_NAME'];
$public_end = strpos($script_name, '/public') + 7; // 7 = length of "/public"
$web_root = substr($script_name, 0, $public_end);
define('WWW_ROOT', $web_root); // This will be something like "/yourproject/public"




require_once('functions.php');
require_once('db_functions.php');
require_once('config.php');
require_once(PROJECT_PATH . '/private/classes/databaseobject.class.php');
require_once(PROJECT_PATH . '/private/classes/admin.class.php');
require_once(PROJECT_PATH . '/private/classes/home.class.php');
require_once(PROJECT_PATH . '/private/classes/homeimage.class.php');
require_once('validation_functions.php');
$database = db_connect();
DatabaseObject::set_database($database);
Home::set_database($database);
HomeImage::set_database($database);
Admin::set_database($database);
?>