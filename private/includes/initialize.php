 <?php
  define("PRIVATE_PATH", dirname(__FILE__));
  define("PROJECT_PATH", dirname(PRIVATE_PATH));
  define("PUBLIC_PATH", PROJECT_PATH);
  define("SHARED_PATH", PRIVATE_PATH);

$doc_root = $_SERVER['DOCUMENT_ROOT'];
$script_name = $_SERVER['SCRIPT_NAME'];
$public_end = strpos($script_name, '/public') + 7; // 7 = length of "/public"
$web_root = substr($script_name, 0, $public_end);
define('WWW_ROOT', $web_root); // This will be something like "/yourproject/public"

require_once('functions.php');
require_once('db_functions.php');
require_once('config.php');
require_once(PROJECT_PATH . '/classes/databaseobject.class.php');
require_once(PROJECT_PATH . '/classes/admin.class.php');
require_once(PROJECT_PATH . '/classes/home.class.php');
require_once('validation_functions.php');
$database = db_connect('')
?>