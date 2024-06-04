export interface AuthPayload {
  firstName: string;
  lastName: string;
  userName: string;
  twilioToken: string;
  exp: number;
  iat: number;
  sub: number;
}
