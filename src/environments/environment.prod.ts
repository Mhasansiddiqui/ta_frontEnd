export const environment = {
  production: true,
  apiUrl: 'https://respectful-reflection-production.up.railway.app',
  freeCurrencyApiKey: '' as string
}
  freeCurrencyApiKey: process.env['FREECURRENCY_API_KEY']
};