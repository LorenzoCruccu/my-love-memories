import React from 'react';
import {type ControlPosition, MapControl} from '@vis.gl/react-google-maps';

import {PlaceAutocompleteClassic} from './autocompleteClassic';

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const CustomMapControl = ({
  controlPosition,
  onPlaceSelect
}: CustomAutocompleteControlProps) => {

  return (
    <MapControl position={controlPosition}>
      <div className="autocomplete-control">
			<PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
     
      </div>
    </MapControl>
  );
};
