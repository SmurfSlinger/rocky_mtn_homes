<?php

/**
 * @property int $id
 * @property int $home_id
 * @property string $image_path
 */

class HomeImage extends DatabaseObject {
    static protected $table_name = "home_images";
    static protected $db_columns = ['id', 'home_id', 'image_path'];

    public $id;
    public $home_id;
    public $image_path;

    public function __construct($args=[]) {
        $this->id = $args['id'] ?? null;
        $this->home_id = $args['home_id'] ?? '';
        $this->image_path = $args['image_path'] ?? '';
    }

    // Find all images for a given home_id
    static public function find_by_home_id($home_id) {
        $sql = "SELECT * FROM " . static::$table_name . " WHERE home_id='" . self::$database->escape_string($home_id) . "'";
        $obj_array = static::find_by_sql($sql);
        return $obj_array;
    }

    // Validate image (simple example)
    protected function validate() {
        $this->errors = [];

        if (is_blank($this->home_id)) {
            $this->errors[] = "Home ID cannot be blank.";
        }
        if (is_blank($this->image_path)) {
            $this->errors[] = "Image path cannot be blank.";
        }

        return $this->errors;
    }

    // Override create to run validation before inserting
    public function create() {
        $this->validate();
        if (!empty($this->errors)) {
            return false;
        }
        return parent::create();
    }

    static public function find_by_id($id) {
  $sql = "SELECT * FROM " . static::$table_name . " WHERE id='" . self::$database->escape_string($id) . "'";
  $obj_array = static::find_by_sql($sql);
  return !empty($obj_array) ? array_shift($obj_array) : false;
}

public function delete() {
  $sql = "DELETE FROM " . static::$table_name . " WHERE id='" . self::$database->escape_string($this->id) . "' LIMIT 1";
  $result = self::$database->query($sql);
  return $result && self::$database->affected_rows == 1;
}

}
