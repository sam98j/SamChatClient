export interface SignUpDto {
  email: string;
  password: string;
  avatar: File | null;
  name: string;
  usrname: string;
}
