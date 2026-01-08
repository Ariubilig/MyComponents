// Never forget to: this is a usage example for the usePreloaderGuard hook
// call sessionStorage in the component
// call setShouldShow manually
// duplicate safety timers


import { useEffect } from 'react';
import { usePreloaderGuard } from '../../hooks/useGuard/useGuard';


const { shouldShow, finish } = usePreloaderGuard();

useEffect(() => {
  if (!shouldShow) return;

  // animation here
  // call finish() ONLY once
}, [shouldShow, finish]);

if (!shouldShow) return null;
