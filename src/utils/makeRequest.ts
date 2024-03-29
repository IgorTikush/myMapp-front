import ky from 'ky';

export const makeRequest = ({
  url,
  method = 'GET',
  body,
  headers,
  isBuffer = false,
}: { url: string; method?: string; body?: any; headers?: any; isBuffer?: boolean }): any => {
  const userToken = localStorage.getItem('@myMapp:access_token');
  if (!headers) {
    headers = {
      Authorization: `Bearer ${userToken}`,
    };
  }

  const options: any = {
    method,
    headers,
    timeout: false,
  };

  if (body && !isBuffer) {
    options.json = body;
  }

  if (isBuffer) {
    options.body = body;
  }

  return ky(url, options).json();
};
