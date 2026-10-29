'use client';

import { useEffect, useState } from 'react';

export function LocalTime() {
  const [time, setTime] = useState('Europa / Madrid');
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'shortOffset' });
    const update = () => setTime(formatter.format(new Date()));
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 30_000);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); };
  }, []);
  return <p>{time}</p>;
}
