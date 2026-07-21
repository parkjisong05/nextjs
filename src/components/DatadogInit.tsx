"use client";

import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

const DATADOG_SITE = 'us5.datadoghq.com';

let isInitialized = false;

export function DatadogInit() {
  useEffect(() => {
    if (isInitialized) {
      return;
    }

    const applicationId = '46c20008-88ec-449d-ac1d-db5c7536c6fd';
    const clientToken = 'pub6d24adad489bbf9690f729f99d3f7403';
    const service = process.env.NEXT_PUBLIC_DATADOG_SERVICE ?? process.env.NEXT_PUBLIC_APP_NAME;
    const env = process.env.NEXT_PUBLIC_DATADOG_ENV ?? process.env.NODE_ENV;
    const version = process.env.NEXT_PUBLIC_DATADOG_VERSION ?? process.env.NEXT_PUBLIC_APP_VERSION;

    if (!applicationId || !clientToken || !service || !env || !version) {
      return;
    }

    datadogRum.init({
      applicationId,
      clientToken,
      site: 'us5.datadoghq.com',
      service,
      env,
      version,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackResources: true,
      trackUserInteractions: true,
      trackLongTasks: true,
    });

    isInitialized = true;
  }, []);

  return null;
}
