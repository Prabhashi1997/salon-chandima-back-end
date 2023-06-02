export interface UserCreationParams {
  firstName: string;
  lastName: string;
  epfNo: number;
  designation?: any;
  email: string;
  image?: string;
  doj?: string;
  roles?: string[];
}
