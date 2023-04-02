import mapboxgl from 'mapbox-gl';
import React, { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { mapboxToken } from '../../../config';
import { UserContext } from '../../context/userContext';
import countries from '../../countries.json';
import { BASE_API_URL } from '../../utils/constants';
import { makeRequest } from '../../utils/makeRequest';

export const Map = (): JSX.Element => {
  const visitedCountries = useRef<any>([]);
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);

  const { map: mapInfo } = useContext(UserContext);

  const { id: mapId } = useParams();

  mapboxgl.accessToken = mapboxToken;
  let hoveredStateId: any = null;
  useEffect(() => {
    if (!mapInfo._id || map.current) {
      return;
    }

    makeRequest({ url: `${BASE_API_URL}/map/${mapId}`, method: 'GET' }).then((res: any) => {
      console.log('request');
      console.log(res);
      visitedCountries.current = res.visitedCountries;
    }).then(initMap);
  },[]);

  const initMap = (): void => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-70.9, 42.35],
      zoom: 1,
    });

    map.current.on('load', () => {
      // map.current.addLayer({
      //   id: 'countries',
      //   type: 'line',
      //   'source-layer': 'country_boundaries',
      //   source: {
      //     type: 'vector',
      //     url: 'mapbox://mapbox.country-boundaries-v1',
      //   },
      //   // 'source-layer': 'contour',
      // });
      map.current.addSource('countries', {
        'type': 'geojson',
        'data': countries,
        generateId: true,
      });
      map.current.addLayer({
        'id': 'country',
        'type': 'fill',
        'source': 'countries',
        'layout': {
        },
        'paint': {
          'fill-color': '#080d1e',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.3,
            0.7,
          ],
        },
      });

      visitedCountries.current.forEach((countryId: number) => {
        map.current.setFeatureState(
          { source: 'countries', id: countryId },
          { hover: true },
        );
      });
    });

    map.current.on('mousemove', 'country', (event: any) => {
      if (event.features.length <= 0) {
        return;
      }

      if (hoveredStateId !== null && !visitedCountries.current.includes(hoveredStateId)) {
        map.current.setFeatureState(
          { source: 'countries', id: hoveredStateId },
          { hover: false },
        );
      }

      hoveredStateId = event.features[0].id;
      map.current.setFeatureState(
        { source: 'countries', id: hoveredStateId },
        { hover: true },
      );
    });

    map.current.on('mouseleave', 'country', () => {
      if (!hoveredStateId || visitedCountries.current.includes(hoveredStateId)) {
        return;
      }

      map.current.setFeatureState(
        { source: 'countries', id: hoveredStateId },
        { hover: false },
      );
      hoveredStateId = null;
    });

    map.current.on('click', 'country', (event: any) => {
      const visitedCountryID = event.features[0].id;

      if (visitedCountries.current.includes(visitedCountryID)) {
        map.current.setFeatureState(
          { source: 'countries', id: visitedCountryID },
          { hover: false },
        );
        visitedCountries.current = visitedCountries.current.filter((countryId: any) => countryId !== visitedCountryID);

        return;
      }

      map.current.setFeatureState(
        { source: 'countries', id: visitedCountryID },
        { hover: true },
      );

      visitedCountries.current = [...visitedCountries.current, visitedCountryID];
      makeRequest({ url: `${BASE_API_URL}/map/${mapId}/add_country`, method: 'PATCH', body: { countryIdToAdd: event.features[0].id } });
    });
  };

  return (
    <div ref={mapContainer} style={{ height: 500 }} />
  );
};
