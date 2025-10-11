const http = require('http');

const MAX_RETRIES = 60;
const RETRY_INTERVAL = 5000; // 5 seconds

async function waitForSonar(retries = 0) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 9001,
      path: '/api/system/status',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const status = JSON.parse(data);
          if (status.status === 'UP') {
            console.log('✅ SonarQube is ready!');
            resolve();
          } else {
            throw new Error('SonarQube not ready yet');
          }
        } catch (error) {
          if (retries < MAX_RETRIES) {
            console.log(`⏳ Waiting for SonarQube... (${retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => {
              waitForSonar(retries + 1).then(resolve).catch(reject);
            }, RETRY_INTERVAL);
          } else {
            reject(new Error('SonarQube failed to start'));
          }
        }
      });
    });

    req.on('error', (error) => {
      if (retries < MAX_RETRIES) {
        console.log(`⏳ Waiting for SonarQube... (${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          waitForSonar(retries + 1).then(resolve).catch(reject);
        }, RETRY_INTERVAL);
      } else {
        reject(error);
      }
    });

    req.end();
  });
}

waitForSonar().catch((error) => {
  console.error('❌ Failed to connect to SonarQube:', error.message);
  process.exit(1);
});
