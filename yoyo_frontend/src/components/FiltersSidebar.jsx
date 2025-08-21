import React from 'react';
import { 
  Slider, 
  Checkbox, 
  FormControlLabel, 
  FormGroup, 
  FormControl, 
  FormLabel, 
  Radio, 
  RadioGroup,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';

function FiltersSidebar({ filters, onChange, onReset }) {
  // Sample amenities data
  const amenities = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'parking', label: 'Parking' },
    { id: 'gym', label: 'Gym' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'pet', label: 'Pet Friendly' },
  ];

  // Property types
  const propertyTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'house', label: 'House' },
    { id: 'condo', label: 'Condo' },
    { id: 'villa', label: 'Villa' },
    { id: 'hotel', label: 'Hotel' },
  ];

  // Guest ratings
  const ratings = [
    { id: 'any', label: 'Any Rating' },
    { id: '9+', label: '9+ Excellent' },
    { id: '8+', label: '8+ Very Good' },
    { id: '7+', label: '7+ Good' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xs border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FilterListIcon className="text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        </div>
        <Button 
          onClick={onReset}
          size="small"
          className="text-blue-600 hover:bg-blue-50"
        >
          Reset All
        </Button>
      </div>

      <Divider className="mb-6" />

      {/* Price Range Filter */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-700">Price Range</h3>
          <span className="text-sm font-medium text-blue-600">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>
        <Slider
          value={filters.priceRange}
          onChange={onChange.price}
          min={0}
          max={500}
          step={10}
          valueLabelDisplay="auto"
          className="text-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$0</span>
          <span>$500</span>
        </div>
      </div>

      <Divider className="mb-6" />

      {/* Property Type Filter */}
      <Accordion defaultExpanded className="shadow-none mb-4">
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon className="text-gray-500" />}
          className="p-0 min-h-0"
        >
          <h3 className="font-semibold text-gray-700">Property Type</h3>
        </AccordionSummary>
        <AccordionDetails className="p-0 pt-2">
          <FormControl component="fieldset">
            <RadioGroup 
              name="propertyType" 
              value={filters.propertyType || 'all'}
              onChange={onChange.propertyType}
            >
              {propertyTypes.map((type) => (
                <FormControlLabel
                  key={type.id}
                  value={type.id}
                  control={<Radio size="small" className="text-blue-600" />}
                  label={<span className="text-gray-700">{type.label}</span>}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Divider className="mb-6" />

      {/* Amenities Filter */}
      <Accordion defaultExpanded className="shadow-none mb-4">
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon className="text-gray-500" />}
          className="p-0 min-h-0"
        >
          <h3 className="font-semibold text-gray-700">Amenities</h3>
        </AccordionSummary>
        <AccordionDetails className="p-0 pt-2">
          <FormGroup>
            {amenities.map((amenity) => (
              <FormControlLabel
                key={amenity.id}
                control={
                  <Checkbox
                    checked={filters.amenities?.includes(amenity.id) || false}
                    onChange={() => onChange.amenities(amenity.id)}
                    size="small"
                    className="text-blue-600"
                  />
                }
                label={<span className="text-gray-700">{amenity.label}</span>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider className="mb-6" />

      {/* Guest Rating Filter */}
      <Accordion className="shadow-none mb-4">
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon className="text-gray-500" />}
          className="p-0 min-h-0"
        >
          <h3 className="font-semibold text-gray-700">Guest Rating</h3>
        </AccordionSummary>
        <AccordionDetails className="p-0 pt-2">
          <FormControl component="fieldset">
            <RadioGroup 
              name="rating" 
              value={filters.rating || 'any'}
              onChange={onChange.rating}
            >
              {ratings.map((rating) => (
                <FormControlLabel
                  key={rating.id}
                  value={rating.id}
                  control={<Radio size="small" className="text-blue-600" />}
                  label={<span className="text-gray-700">{rating.label}</span>}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Divider className="my-6" />

      {/* Apply Button */}
      <Button 
        variant="contained" 
        fullWidth
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md"
        onClick={onChange.apply}
      >
        Apply Filters
      </Button>
    </div>
  );
}

export default FiltersSidebar;