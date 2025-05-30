export interface ProfileDB {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string;
  created_at: Date;
  phone: number;
  campaings: string[];
  rol: number;
}
