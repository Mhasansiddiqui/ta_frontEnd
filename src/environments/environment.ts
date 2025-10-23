interface Environment {
  production: boolean;
  apiUrl: string;
  freeCurrencyApiKey: string;
}

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3001',
  freeCurrencyApiKey: ''
}