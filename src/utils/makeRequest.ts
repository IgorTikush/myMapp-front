import ky from 'ky';

export const makeRequest = ({
  url,
  method = 'GET',
  body,
  headers,
}: { url: string; method?: string; body?: any; headers?: any }): any => {
  const userToken = localStorage.getItem('@myMapp:access_token');
  if (!headers) {
    headers = {
      Authorization: `Bearer ${userToken}`,
    };
  }

  const options: { method: string; headers: { Authorization: string }; json?: any } = {
    method,
    headers,
  };

  if (body) {
    options.json = body;
  }

  return ky(url, options).json();
};
