<?php

class DatabaseObject {

    static protected $database;
    static protected $table_name = '';
    static protected $db_columns = [];
    public $errors = [];
    public $id;

    // Set the database connection
    static public function set_database($database) {
        self::$database = $database;
    }

    // Retrieve all records
    static public function find_all() {
        $sql = "SELECT * FROM " . static::$table_name;
        return static::find_by_sql($sql);
    }

    // Find a record by ID
    static public function find_by_id($id) {
        $sql = "SELECT * FROM " . static::$table_name;
        $sql .= " WHERE id='" . self::$database->escape_string($id) . "'";
        $obj_array = static::find_by_sql($sql);
        return !empty($obj_array) ? array_shift($obj_array) : false;
    }

    // Run raw SQL and convert to object array
    static public function find_by_sql($sql) {
        $result = self::$database->query($sql);
        if(!$result) {
            exit("Database query failed.");
        }

        $object_array = [];
        while($record = $result->fetch_assoc()) {
            $object_array[] = static::instantiate($record);
        }

        $result->free();
        return $object_array;
    }

    // Convert DB row to object
    static protected function instantiate($record) {
        $object = new static;
        foreach($record as $property => $value) {
        if(property_exists($object, $property)) {
            $object->$property = $value; 
        }
    }
        return $object;
    }

    // Merge form values into object properties
    public function merge_attributes($args = []) {
        foreach($args as $key => $value) {
            if(property_exists($this, $key) && !is_null($value)) {
                $this->$key = $value;
            }
        }
    }

    // Return an associative array of object properties (excluding ID)
    public function attributes() {
        $attributes = [];
        foreach(static::$db_columns as $column) {
            if($column == 'id') continue;
            $attributes[$column] = $this->$column;
        }
        return $attributes;
    }

    // Escape the attributes for safe SQL insertion
    protected function sanitized_attributes() {
        $sanitized = [];
        foreach($this->attributes() as $key => $value) {
            $sanitized[$key] = self::$database->escape_string($value);
        }
        return $sanitized;
    }

    // Default: no validation errors
    protected function validate() {
        $this->errors = [];
        // Custom model-specific validation goes in subclasses
        return $this->errors;
    }

    // Save the object (create or update)
    public function save() {
        return isset($this->id) ? $this->update() : $this->create();
    }

    // Create a new database record
    protected function create() {
  $this->validate();
  if (!empty($this->errors)) {
    return false;
  }

  $attributes = $this->sanitized_attributes();
  $sql = "INSERT INTO " . static::$table_name . " (";
  $sql .= join(', ', array_keys($attributes));
  $sql .= ") VALUES ('";
  $sql .= join("', '", array_values($attributes));
  $sql .= "')";

  // DEBUGGING:
  echo "<pre>$sql</pre>"; // Show the generated SQL
  $result = self::$database->query($sql);

  if (!$result) {
    echo "MySQL Error: " . self::$database->error;
    return false;
  }

  $this->id = self::$database->insert_id;
  return true;
}


    // Update an existing record
    protected function update() {
        $this->validate();
        if (!empty($this->errors)) return false;

        $attributes = $this->sanitized_attributes();
        $attribute_pairs = [];
        foreach($attributes as $key => $value) {
            $attribute_pairs[] = "{$key}='{$value}'";
        }

        $sql = "UPDATE " . static::$table_name . " SET ";
        $sql .= join(', ', $attribute_pairs);
        $sql .= " WHERE id='" . self::$database->escape_string($this->id) . "' ";
        $sql .= "LIMIT 1";

        return self::$database->query($sql);
    }

    // Delete the record
    public function delete() {
        $sql = "DELETE FROM " . static::$table_name;
        $sql .= " WHERE id='" . self::$database->escape_string($this->id) . "' ";
        $sql .= "LIMIT 1";

        return self::$database->query($sql);
    }
}
?>
