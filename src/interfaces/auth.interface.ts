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
}
