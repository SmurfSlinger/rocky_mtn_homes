<?php

class DatabaseObject {

    static protected $database;
    static protected $table_name = "";
    static protected $columns = [];
    static protected $db_columns;
    public $errors = [];
    public $id;

    public function create()
    {
        $new = new static;
        return $new;
    }

    public static function find_by_id($id)
    {
        $sql = "SELECT * FROM self::table_name ";
        $sql .= "WHERE id='" . self::$database->escape_string($id) . "'";
        $obj_array = static::find_by_sql($sql);
        if(!empty($obj_array))
        {
            return array_shift($obj_array);
        }
        else
        {
            return false;
        }
    }

    public static function find_by_sql($sql)
    {
       $result = self::$database->query($sql);
       if(!$result)
       {
        exit("Database query failed. (Find By SQL");
       }
        // results into objects
        $object_array = [];
        while($record = $result->fetch_assoc())
        {
            $object_array[] = static::instantiate($record);
        }

    }

    public function update()
    {

    }

    public function delete()
    {

    }

    static public function set_database($database)
    {
        self::$database = $database;
    }

     static protected function instantiate($record)
    {
        $object = new static;
        // Could manually assign values to properties
        // but automatically assignment is easier and re-usable
        foreach($record as $property => $value)
        {
            if(property_exists($object, $property))
            {
                $object->$property = $value;
            }
        }
        return $object;
    }

}


?>