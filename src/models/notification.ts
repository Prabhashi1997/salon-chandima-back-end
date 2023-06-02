export interface NotificationData {
  id?: number;
  title: string;
  description: string;
  time?: Date;
  url: string;
  read?: boolean;
  user: number;
  image?: string;
}
