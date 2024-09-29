import { LoggedInUserData } from '@/redux/auth.slice';
import { Session } from 'next-auth';

export interface SignUpDto {
  email: string;
  password: string;
  avatar: File | null;
  name: string;
  usrname: string;
}

export interface GoogleSignInSession extends Session {
  authToken: string;
  loggedInUser: Pick<LoggedInUserData, 'avatar' | '_id' | 'name'>;
}

// loginDTO
export interface LoginDTO {
  email: string;
  password: string;
}
