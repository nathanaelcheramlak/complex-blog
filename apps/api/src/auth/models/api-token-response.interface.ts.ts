export interface AuthTokenResponse {
  readonly accessToken: string;
  readonly user: {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly bio: string | null;
    readonly avatar: string | null;
  };
}
