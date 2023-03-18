import { createContext, Context } from 'react';

import { IUser } from '../features/auth/interfaces/user.interface';

export const userDefault = {
  _id: '',
  email: '',
  username: '',
  map: {},
  updateUser: (): null => null,
};

export interface IUserCtx extends IUser {
  updateUser: (userInfo: IUser) => void;
}

export const UserContext: Context<IUserCtx> = createContext<IUserCtx>(userDefault);
