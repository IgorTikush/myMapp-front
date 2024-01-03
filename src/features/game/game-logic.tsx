import { Alert, Snackbar } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { TGameStatus } from './types/game.types';
import { mapboxToken } from '../../../config';
import countries from '../../countries.json';

const GAME_LENGTH_IN_ML_SECONDS = 60000;

interface IGameLogic {
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  setGameStatus: Dispatch<SetStateAction<TGameStatus>>;
}

export const GameLogic = (props: IGameLogic): JSX.Element => {

  const { score, setScore, setGameStatus } = props;
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const countryToGuess = useRef<string>('');

  const [timeRemaining, setTimeRemaining] = useState(GAME_LENGTH_IN_ML_SECONDS + 2);
  const [open, setOpen] = React.useState(false);
  // const [forceRender, setForceRender] = useState(false);

  const targetDate = new Date().getTime() + GAME_LENGTH_IN_ML_SECONDS;

  useEffect(() => {
    const countdown = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(countdown);
        setGameStatus('finished');
      }
    }, 1000);

    initMap();

    return () => clearInterval(countdown);
  },[]);

  const calculateTimeRemaining = () => {
    const now = new Date().getTime();

    return Math.floor((targetDate - now) / 1000);
  };

  const getRandomCountry = () => countries.features[Math.floor(Math.random() * countries.features.length)];

  if (!countryToGuess.current) {
    const randomCountry: any = getRandomCountry();
    countryToGuess.current = randomCountry.properties.name;
  }

  const handleSuccess = () => {
    setOpen(true);
    setScore((prev) => prev + 1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const passCountry = () => {
    const randomCountry: any = getRandomCountry();
    countryToGuess.current = randomCountry.properties.name;
    // setForceRender(prev => !prev);
    setScore((prev) => prev - 1);
  };

  mapboxgl.accessToken = mapboxToken;
  let hoveredStateId: any = null;

  const initMap = (): void => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-70.9, 42.35],
      zoom: 1,
    });

    map.current.on('load', () => {
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

      map.current.style.stylesheet.layers.forEach((layer: mapboxgl.Layer) => {
        if (layer.type === 'symbol') {
          map.current.removeLayer(layer.id);
        }
      });
    });

    map.current.on('mousemove', 'country', (event: any) => {
      if (event.features.length <= 0) {
        return;
      }

      if (hoveredStateId !== null) {
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
      if (!hoveredStateId) {
        return;
      }

      map.current.setFeatureState(
        { source: 'countries', id: hoveredStateId },
        { hover: false },
      );
      hoveredStateId = null;
    });

    map.current.on('click', 'country', (event: any) => {
      const clickedCountryName = event.features[0].properties.name;
      if (clickedCountryName === countryToGuess.current) {
        handleSuccess();
        const randomCountry: any = countries.features[Math.floor(Math.random()*countries.features.length)];
        countryToGuess.current = randomCountry.properties.name_long;

      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {countryToGuess.current}
        <button onClick={passCountry}>
          pass
        </button>
      </div>
      <div ref={mapContainer} style={{ height: '100%', width: '60%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          Your score:
          {' '}
          {score}
        </div>
        <div>
          Time:
          {' '}
          {timeRemaining}
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Right!
        </Alert>
      </Snackbar>
    </div>
  );
};
