import Pyroscope from '@pyroscope/nodejs';

export function initProfiling(): void {
  const serverAddress = process.env.PYROSCOPE_SERVER_ADDRESS || 'http://pyroscope:4040';
  const appName = process.env.PYROSCOPE_APPLICATION_NAME || 'nestjs-service';

  try {
    Pyroscope.init({
      serverAddress,
      appName,
      tags: {
        env: process.env.NODE_ENV || 'development',
      },
      wall: {
        collectCpuTime: true,
      },
    });
    Pyroscope.start();
    console.log(`[Pyroscope] Profiling started for ${appName} -> ${serverAddress}`);
  } catch (error) {
    console.error('[Pyroscope] Failed to initialize profiling:', error);
  }
}
