// @ts-check
import { defineConfig } from 'astro/config';
import orizFleet from '@oriz/api-fleet-template';

export default defineConfig({
  output: 'static',
  site: 'https://rto.oriz.in',
  integrations: [
    orizFleet({
      apiName: 'rto',
      apiTitle: 'Indian RTO Codes API',
      apiDescription: 'Free static API for all 1299 Indian Regional Transport Office codes. No auth, no rate limit, no cost. Just JSON.',
      stats: '1299 RTO codes ; CC BY-SA 4.0 ; MIT',
      themeColor: 'orange',
      githubRepo: 'oriz-org/rto-api',
      sampleEndpoint: '/codes/MH-12.json',
      sampleResponse: {
        code: 'MH-12',
        state_code: 'MH',
        state: 'Maharashtra',
        office: 'Pune',
        district: 'Pune',
        notes: '',
      },
      dataDirs: ['codes', 'states'],
      indexFiles: ['index.json', 'all.json', 'states.json'],
    }),
  ],
});
