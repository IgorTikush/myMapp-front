import { useState } from 'react';

import { IUserCtx, userDefault } from '../context/userContext';
import { IUser } from '../features/auth/interfaces/user.interface';

export const useUser = (): IUserCtx => {
  const [user, setUser] = useState<IUser>(userDefault);

  const updateUser = (userInfo: IUser): void => {
    setUser(prev => ({
      ...prev,
      ...userInfo,
    }));
  };

  return {
    ...user,
    updateUser,
  };
};
