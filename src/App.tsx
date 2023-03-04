import { Routes, Route } from 'react-router-dom';

import { Registration } from './auth/Registration';

export const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<Registration />} />
      <Route index element={<Registration />} />
      {/* Private routes */}
    </Routes>
  );
}
