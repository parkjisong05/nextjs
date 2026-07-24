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

    const applicationId = '6ddac1d1-0fa2-438a-8b28-3644459c7d0a';
    const clientToken = 'pub85ef1a9278536f531e245c4e4e7a9612';
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
      sessionReplaySampleRate: 100,
      trackResources: true,
      trackUserInteractions: true,
      trackLongTasks: true,
    });

    isInitialized = true;
  }, []);

  return null;
}
