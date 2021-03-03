import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../Styles/Map.css';

import { ControlPanel } from './ControlPanel';

mapboxgl.accessToken = 'pk.eyJ1IjoibXhzdW4iLCJhIjoiY2ppb3FiYmQ0MG55ZjNrbWYwZGNlOHRzNCJ9.Vw8Dy9FI51LJkhl6MUsqNQ';

export const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(1.5);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapObject = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom,
    });

    // Add navigation control (the +/- zoom buttons)
    mapObject.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapObject.on('move', () => {
      setLng(mapObject.getCenter().lng.toFixed(4));
      setLat(mapObject.getCenter().lat.toFixed(4));
      setZoom(mapObject.getZoom().toFixed(2));
    });

    setMap(mapObject);

    return () => mapObject.remove();
  }, []);

  // Helper function for adding/toggling layers on the map
  const setLayer = (fname, bbox, on) => {
    if (!map.getSource(fname)) {
      console.log('adding source', bbox, fname);
      map.addSource(fname, {
        type: 'image',
        url: `http://0.0.0.0:8080/api/image/${fname}`,
        coordinates: [
          [bbox[0][0], bbox[1][1]],
          [bbox[1][0], bbox[1][1]],
          [bbox[1][0], bbox[0][1]],
          [bbox[0][0], bbox[0][1]],
        ],
      });
    }

    if (on) {
      map.removeLayer(fname);
    } else {
      map.addLayer({
        id: fname,
        type: 'raster',
        source: fname,
        paint: { 'raster-opacity': 0.7 },
      });
    }
  };

  const flyMap = (x, y) => {
    map.flyTo({
      center: [x, y],
      zoom: 14,
      essential: true,
    });
    setLng(x);
    setLat(y);
  };

  return (
    <div>
      <ControlPanel
        setLayer={setLayer}
        flyTo={flyMap}
      />
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
