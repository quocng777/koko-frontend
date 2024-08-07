export type LoginRequest = {
    username: string;
    password: string;
}

export type TokenResponse = {
    refreshToken: string;
    accessToken: string;
}