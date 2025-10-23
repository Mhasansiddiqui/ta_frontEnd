interface Environment {
  production: boolean;
  apiUrl: string;
  freeCurrencyApiKey: string;
}

export const environment: Environment = {
  production: true,
  apiUrl: 'https://respectful-reflection-production.up.railway.app',
  freeCurrencyApiKey: ''
}
  freeCurrencyApiKey: process.env['FREECURRENCY_API_KEY']
