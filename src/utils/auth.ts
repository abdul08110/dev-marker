export const getToken = (): string | null => {
    return localStorage.getItem('access_token') || null;
};

export const removeTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('name');
}

export const getName = (): string | null => {
    return localStorage.getItem('name') || null;
}