import { createContext, Context } from 'react';

import { IUser } from '../features/auth/interfaces/user.interface';

export const userDefault = {
  _id: '',
  email: '',
  username: '',
}

export const  UserContext: Context<IUser> = createContext(userDefault);


