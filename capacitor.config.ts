/// <reference types="@capawesome/capacitor-android-edge-to-edge-support" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'notturna.gdr.larp',
  appName: 'Notturna',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'disable',
    },
    Keyboard: {
      resizeOnFullScreen: false,
    },
  },
};

export default config;
