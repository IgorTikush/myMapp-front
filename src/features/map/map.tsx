import { Box, Button, Modal } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import React, { useContext, useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createRoot } from 'react-dom/client';
import { useParams } from 'react-router-dom';
import heic2any from 'heic2any';

import { boxStyle } from './styles/picture-modal.style.tx';
import { mapboxToken } from '../../../config';
import { UserContext } from '../../context/userContext';
import countries from '../../countries.json';
import { BASE_API_URL } from '../../utils/constants';
import { makeRequest } from '../../utils/makeRequest';

let uploadPictureCoordinates: number[] = [];

export const Map = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [pictureURL, setPictureURL] = useState('');
  const [pictureId, setPictureId] = useState('');
  // const [uploadPictureCoordinates, setUploadPictureCoordinates] = useState<number[]>([]);

  const visitedCountries = useRef<any>([]);
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const markers = useRef<any>([]);
  const userCanEdit = useRef<boolean>(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const { map: mapInfo } = useContext(UserContext);

  let { id: mapId } = useParams();

  if (!mapId) {
    mapId = mapInfo._id;
  }

  userCanEdit.current = mapId === mapInfo._id;

  mapboxgl.accessToken = mapboxToken;
  let hoveredStateId: any = null;
  useEffect(() => {
    if (!mapId || map.current) {
      return;
    }

    makeRequest({ url: `${BASE_API_URL}/map/${mapId}`, method: 'GET' }).then((res: any) => {
      console.log(res);
      visitedCountries.current = res.visitedCountries;
      markers.current = res.pictures;
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

      markers.current.forEach((marker: any) => {
        const el = document.createElement('div');
        const width = 30;
        const height = 30;
        el.className = 'marker';
        el.style.backgroundImage = `url(${marker.url})`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';
        el.style.borderRadius = '50%';
        new mapboxgl.Marker(el)
          .setLngLat(marker.coordinates)
          .addTo(map.current);

        el.addEventListener('click', () => {
          setPictureURL(marker.url);
          setPictureId(marker._id);
          handleOpen();
        });
      });
    });

    map.current.on('mousemove', 'country', (event: any) => {
      if (!userCanEdit.current) {
        return;
      }

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
      if (!userCanEdit.current) {
        return;
      }

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
      if (!userCanEdit.current) {
        return;
      }

      const visitedCountryID = event.features[0].id;

      if (visitedCountries.current.includes(visitedCountryID)) {
        map.current.setFeatureState(
          { source: 'countries', id: visitedCountryID },
          { hover: false },
        );
        visitedCountries.current = visitedCountries.current.filter((countryId: any) => countryId !== visitedCountryID);

        makeRequest({ url: `${BASE_API_URL}/map/${mapId}/delete_country`, method: 'PATCH', body: { countryIdToDelete: event.features[0].id } });

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
      console.log(file);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      let result;

      reader.onload = async (): Promise<void> => {
        result = reader.result;
        if (file.name?.toLowerCase()?.includes('.heic')) {
          console.log('to heic');
          const blob =  await heic2any({
            blob: new Blob([reader.result as ArrayBuffer]),
            toType: 'image/jpeg',
            quality: 0.5,
          });

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          result = await blob.arrayBuffer();
        }

        // request to get link to upload
        const uploadUrl = await makeRequest({
          url: `${BASE_API_URL}/map/${mapId}/picture_upload_url?mapId=${mapId}`,
          method: 'GET',
        });

        console.log(uploadUrl);
        // get download url

        const headers: any = {
          'Content-Type': 'image/jpeg',
          'Content-Length': (result as any).byteLength,
        };

        console.log((result));

        const res = await makeRequest({
          // url: uploadUrl.uploadUrl,
          url: uploadUrl.uploadUrl,
          method: 'PUT',
          headers,
          isBuffer: true,
          body: result,
        } as any).catch((error: any) => {
          console.log(error);

          return 'error';
        });

        if (res === 'error') {
          console.log('error');

          return;
        }

        const [pictureUrl] = uploadUrl.uploadUrl.split('?');
        console.log(uploadPictureCoordinates);
        await makeRequest({
          url: `${BASE_API_URL}/picture`,
          method: 'POST',
          body: {
            url: pictureUrl,
            mapId,
            coordinates: uploadPictureCoordinates,
          },
        } as any).catch(() => 'error');

        const el = document.createElement('div');
        const width = 30;
        const height = 30;
        el.className = 'marker';
        el.style.backgroundImage = `url(${pictureUrl})`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';
        el.style.borderRadius = '50%';
        new mapboxgl.Marker(el)
          .setLngLat([-83.2192398503004, 37.001400805161055])
          .addTo(map.current);

        el.addEventListener('click', () => {
          setPictureURL(pictureUrl);
          handleOpen();
        });
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
      if (!userCanEdit.current) {
        return;
      }

      const el = document.createElement('div');
      const element = (
        <div style={{ width: 100, height: 100 }} onClick={(): void => {
          handleUploadClick();
          uploadPictureCoordinates = [event.lngLat.lng, event.lngLat.lat];
        }}>
          click here to add photo
          <input
            type='file'
            ref={hiddenFileInput}
            onChange={handleUploadChange}
            style={{ display:'none' }}
          />
        </div>
      );

      createRoot(el).render(element);
      console.log([event.lngLat.lng, event.lngLat.lat]);
      const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat([event.lngLat.lng, event.lngLat.lat])
        .setDOMContent(el)
        .addTo(map.current);
    });
  };

  const deletePicture = (): void => {
    makeRequest({ url: `${BASE_API_URL}/picture/${pictureId}`, method: 'DELETE' }).then(() => {
      markers.current = markers.current.filter((marker: any) => marker._id !== pictureId);
      setPictureURL('');
      setPictureId('');
      handleClose();
    });
  };

  return (
    <>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={boxStyle}>
          <img src={pictureURL} alt='Picture' style={{ width: 300 }} />
          {userCanEdit.current ? <Button onClick={deletePicture}>
            Delete
          </Button> : null}
        </Box>
      </Modal>
    </>
  );
};
