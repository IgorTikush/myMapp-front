import ky from 'ky';

export const makeRequest = ({
  url,
  method = 'GET',
  body,
}: { url: string; method?: string; body?: any }): any => {
  const userToken = localStorage.getItem('@myMapp:access_token');
  console.log(userToken);
  const options: { method: string; headers: { Authorization: string }; json?: any } = {
    method,
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  if (body) {
    options.json = body;
  }

  return ky(url, options).json();
};
