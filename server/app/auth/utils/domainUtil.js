// domainUtil.js
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getDomainName() {
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows ortamı
    return process.env.USERDOMAIN || 'Etki alanı bilgisi bulunamadı';
  } else {
    // Linux/macOS ortamı
    try {
      const { stdout } = await execAsync('dnsdomainname');
      return stdout.trim() || 'Etki alanı bilgisi bulunamadı';
    } catch (err) {
      return 'Etki alanı bilgisi alınamadı: ' + err.message;
    }
  }
}
