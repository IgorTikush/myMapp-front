import { Box, Modal } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import React, { useContext, useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createRoot } from 'react-dom/client';
import { useParams } from 'react-router-dom';

import { boxStyle } from './styles/picture-modal.style.tx';
import { mapboxToken } from '../../../config';
import { UserContext } from '../../context/userContext';
import countries from '../../countries.json';
import { BASE_API_URL } from '../../utils/constants';
import { makeRequest } from '../../utils/makeRequest';

export const Map = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [pictureURL, setPictureURL] = useState('');

  const visitedCountries = useRef<any>([]);
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const { map: mapInfo } = useContext(UserContext);

  let { id: mapId } = useParams();

  if (!mapId) {
    mapId = mapInfo._id;
  }

  mapboxgl.accessToken = mapboxToken;
  let hoveredStateId: any = null;
  useEffect(() => {
    if (!mapInfo._id || map.current) {
      return;
    }

    makeRequest({ url: `${BASE_API_URL}/map/${mapId}`, method: 'GET' }).then((res: any) => {
      visitedCountries.current = res.visitedCountries;
    }).then(initMap);
  },[]);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

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

    const parseFile = (file: File): void => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async (): Promise<void> => {
        // request to get link to upload
        const uploadUrl = await makeRequest({
          url: `${BASE_API_URL}/map/${mapId}/picture_upload_url?mapId=${mapId}`,
          method: 'GET',
        });

        console.log(uploadUrl);
        // get download url

        const headers: any = {
          'Content-Type': 'image/jpeg',
          'Content-Length': (reader.result as any).byteLength,
        };

        console.log((reader.result as any));
        const res = await makeRequest({
          // url: uploadUrl.uploadUrl,
          url: uploadUrl.uploadUrl,
          method: 'PUT',
          headers,
          body: reader.result,
        } as any).catch(console.log);

        console.log(res);
      };
    };

    const handleUploadClick = (): void => {
      if (hiddenFileInput.current) {
        hiddenFileInput.current.value = '';
      }

      hiddenFileInput && hiddenFileInput.current?.click();
    };

    const handleUploadChange = (event: any): void => {
      const filesUploaded = event.target.files;
      console.log(filesUploaded);
      const link = parseFile(filesUploaded[0]);

    };

    map.current.on('contextmenu', async (event: any) => {
      const el = document.createElement('div');
      const element = (
        <div style={{ width: 100, height: 100 }} onClick={handleUploadClick}>
          addPhoto
          <input
            type='file'
            ref={hiddenFileInput}
            onChange={handleUploadChange}
            style={{ display:'none' }}
          />
        </div>
      );

      createRoot(el).render(element);

      const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat([event.lngLat.lng, event.lngLat.lat])
        .setDOMContent(el)
        .addTo(map.current);

      // upload dialog menu

      // get aws signed link from server

      // upload photo

      // remove popup

      // make marker

      // const width = 100;
      // const height = 100;
      // el.className = 'marker';
      // el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
      // el.style.width = `${width}px`;
      // el.style.height = `${height}px`;
      // el.style.backgroundSize = '100%';
      // new mapboxgl.Marker(el)
      //   .setLngLat([event.lngLat.lng, event.lngLat.lat])
      //   .addTo(map.current);
      //
      // el.addEventListener('click', () => {
      //   setPictureURL('https://placekitten.com/g/1440/680/');
      //   handleOpen();
      // });
    });
  };

  return (
    <>
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={boxStyle}>
          <img src={pictureURL} alt='Picture' />
        </Box>
      </Modal>
    </>
  );
};
