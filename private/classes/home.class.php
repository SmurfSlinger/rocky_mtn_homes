<?php


class Home extends DatabaseObject{

    static protected $database = "rocky_mtn_homes";
    static protected $table_name = 'homes';
    static protected $db_columns = [
    'id', 'title', 'price', 'square_footage',
    'length_ft', 'width_ft', 'height_ft',
    'bedrooms', 'bathrooms', 'has_washer_dryer_hookups',
    'has_ac', 'has_furnace', 'includes_appliances',
    'flooring_type', 'year_built', 'description', 'extras', 'image_path', 'status'
    ];

    protected $title;
    protected $price;
    protected $square_footage;
    protected $length_ft;
    protected $width_ft;
    protected $height_ft;
    protected $dimensions = [3];
    protected $description;
    protected $image_path;
    protected $status;
    protected $bedrooms;
    protected $bathrooms;
    protected $has_washer_dryer_hookups;
    protected $has_ac;
    protected $has_furnace;
    protected $includes_appliances;
    protected $flooring_type;
    protected $year_built;
    protected $extras;
    


    
    public function __construct($args = []) {
        $this->title = $args['title'] ?? '';
        $this->price = $args['price'] ?? '';
        $this->square_footage = $args['square_footage'] ?? '';
        $this->length_ft = $args['length_ft'] ?? '';
        $this->width_ft = $args['width_ft'] ?? '';
        $this->height_ft = $args['height_ft'] ?? '';
        $this->dimensions = [
          $this->length_ft,
          $this->width_ft,
          $this->height_ft
        ];

        $this->description = $args['description'] ?? '';
        $this->image_path = $args['image_path'] ?? '';
        $this->status = $args['status'] ?? '';
        $this->bedrooms = $args['bedrooms'] ?? '';
        $this->bathrooms = $args['bathrooms'] ?? '';
        $this->has_washer_dryer_hookups = $args['has_washer_dryer_hookups'] ?? 0;
        $this->has_ac = $args['has_ac'] ?? 0;
        $this->has_furnace = $args['has_furnace'] ?? 0;
        $this->includes_appliances = $args['includes_appliances'] ?? 0;
        $this->flooring_type = $args['flooring_type'] ?? '';
        $this->year_built = $args['year_built'] ?? '';
        $this->extras = $args['extras'] ?? '';
          }
    
    public function formatted_price() {
        return money_format('%i', $this->price);
  }

public function set_image_path($path) {
  $this->image_path = $path;
}


public function validate() {
    $this->errors = [];

    if (empty($this->title)) {
        $this->errors[] = "Title cannot be blank.";
    }
    if (!is_numeric($this->price) || $this->price < 0) {
        $this->errors[] = "Price must be a non-negative number.";
    }
    if (!is_numeric($this->square_footage) || $this->square_footage < 0) {
        $this->errors[] = "Square footage must be a non-negative number.";
    }
    if (!is_numeric($this->length_ft) || $this->length_ft <= 0) {
        $this->errors[] = "Length must be a positive number.";
    }
    if (!is_numeric($this->width_ft) || $this->width_ft <= 0) {
        $this->errors[] = "Width must be a positive number.";
    }
    if (!is_numeric($this->height_ft) || $this->height_ft <= 0) {
        $this->errors[] = "Height must be a positive number.";
    }
    if (!is_numeric($this->bedrooms) || $this->bedrooms < 0) {
        $this->errors[] = "Bedrooms must be a non-negative number.";
    }
    if (!is_numeric($this->bathrooms) || $this->bathrooms < 0) {
        $this->errors[] = "Bathrooms must be a non-negative number.";
    }
    if (empty($this->status)) {
        $this->errors[] = "Status cannot be blank.";
    }
    if (empty($this->description)) {
        $this->errors[] = "Description cannot be blank.";
    }
    // Add other validations as needed

    return empty($this->errors);
}

public function is_dirty() {
    $original = self::find_by_id($this->id);
    foreach (static::$db_columns as $column) {
        if ($this->$column !== $original->$column) {
            return true;
        }
    }
    return false;
}


public function save() {
    if (!$this->validate()) {
        return false;
    }
    return parent::save();
}

public function get_id() {
  return $this->id;
}

public function get_title() {
  return $this->title;
}

public function get_price() {
  return $this->price;
}

public function get_square_footage() {
  return $this->square_footage;
}

public function get_dimensions() {
    return [
        $this->length_ft ?? 0,
        $this->width_ft ?? 0,
        $this->height_ft ?? 0
    ];
}

public function get_length_ft() {
  return $this->length_ft;
}
public function get_width_ft() {
  return $this->width_ft;
}
public function get_height_ft() {
  return $this->height_ft;
}


public function get_description() {
  return $this->description;
}

public function get_image_path() {
  return $this->image_path;
}

public function get_status() {
  return $this->status;
}

public function get_bedrooms() {
  return $this->bedrooms;
}

public function get_bathrooms() {
  return $this->bathrooms;
}

public function get_has_washer_dryer_hookups() {
  return $this->has_washer_dryer_hookups;
}

public function get_has_ac() {
  return $this->has_ac;
}

public function get_has_furnace() {
  return $this->has_furnace;
}

public function get_includes_appliances() {
  return $this->includes_appliances;
}

public function get_flooring_type() {
  return $this->flooring_type;
}

public function get_year_built() {
  return $this->year_built;
}

public function get_extras() {
  return $this->extras;
}

public function get_features_list() {
    $features = [];

    if ($this->has_ac) {
        $features[] = 'Air Conditioning';
    }

    if ($this->has_furnace) {
        $features[] = 'Furnace';
    }

    if ($this->has_washer_dryer_hookups) {
        $features[] = 'Washer/Dryer Hookups';
    }

    if ($this->includes_appliances) {
        $features[] = 'Includes Appliances';
    }

    // Add any other boolean features here similarly.

    // For extras, if it's a string of comma-separated extras, parse and append:
    if (!empty($this->extras)) {
        // Assuming extras are comma-separated
        $extras_array = array_map('trim', explode(',', $this->extras));
        foreach ($extras_array as $extra) {
            if ($extra !== '') {
                $features[] = ucwords($extra);
            }
        }
    }

    return $features;
}



    static protected function instantiate($record) {
        $object = new static;
        $object->hydrate($record);
        return $object;
    }

    public function hydrate($record) {
        foreach ($record as $property => $value) {
            $method = 'set_' . $property;
            if (method_exists($this, $method)) {
                $this->$method($value);
            } elseif (property_exists($this, $property)) {
                // Because we're inside the class, protected properties can be assigned
                $this->$property = $value;
            }
        }
    }

    public function merge_attributes($args = []) {
    foreach ($args as $key => $value) {
        $method = 'set_' . $key;
        if (method_exists($this, $method)) {
            $this->$method($value);
        } elseif (property_exists($this, $key)) {
            $this->$key = $value;
        }
    }
}

public function set_length_ft($value) {
    $this->length_ft = is_numeric($value) ? (float)$value : null;
}

public function set_width_ft($value) {
    $this->width_ft = is_numeric($value) ? (float)$value : null;
}

public function set_height_ft($value) {
    $this->height_ft = is_numeric($value) ? (float)$value : null;
}




}

?>