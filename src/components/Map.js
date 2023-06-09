import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Map as BaseMap, TileLayer, ZoomControl } from 'react-leaflet';

import { useConfigureLeaflet, useMapServices, useRefEffect } from 'hooks';
import { isDomAvailable } from 'lib/util';

const Map = ( props ) => {
  const { children, className, defaultBaseMap = 'OpenStreetMap', mapEffect, ...rest } = props;

  const mapRef = useRef();

  useConfigureLeaflet();

  useRefEffect({
    ref: mapRef,
    effect: mapEffect
  });

  const services = useMapServices({
    names: [defaultBaseMap]
  });
  const basemap = services.find(( service ) => service.name === defaultBaseMap );

  let mapClassName = `map`;

  if ( className ) {
    mapClassName = `${mapClassName} ${className}`;
  }

  if ( !isDomAvailable()) {
    return (
      <div className={mapClassName}>
        <p className="map-loading">Loading map...</p>
      </div>
    );
  }

  const bounds = new L.LatLngBounds( new L.LatLng( -90, -180 ), new L.LatLng( 90, 180 ));

  const mapSettings = {
    className: 'map-base',
    zoomControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    ...rest
  };

  const basemapSettings = {
    ...basemap
  };

  return (
    <div className={mapClassName}>
      <BaseMap ref={mapRef} {...mapSettings}>
        { children }
        { basemap && <TileLayer {...basemapSettings} /> }
        <ZoomControl position="bottomright" />
      </BaseMap>
    </div>
  );
};

Map.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultBaseMap: PropTypes.string,
  mapEffect: PropTypes.func
};

export default Map;
