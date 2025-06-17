/**
 * Bilgisayarın domain/workgroup bilgisini kontrol eder
 * .NET IntraEtkiAlani() fonksiyonunun JavaScript karşılığı
 * @returns {Promise<boolean>} - "internet.idb" domain'inde ise true, değilse false
 */

// Node.js ortamı için (sunucu tarafı)
async function intraEtkiAlaniNodeJS() {
  try {
    const { default: os } = await import('os');
    const { execSync } = await import('child_process');
    
    // Windows ortamında WMI sorgusu ile workgroup/domain bilgisini al
    if (os.platform() === 'win32') {
      try {
        // ManagementObject Win32_ComputerSystem sorgusunun karşılığı
        const wmicCommand = `wmic computersystem get workgroup,domain /format:csv`;
        const result = execSync(wmicCommand, { encoding: 'utf8', timeout: 5000 });
        
        const lines = result.split('\n').filter(line => line.trim() && !line.startsWith('Node'));
        if (lines.length > 0) {
          const fields = lines[0].split(',');
          // CSV formatında: Node,Domain,Workgroup
          const domain = fields[1] ? fields[1].trim() : '';
          const workgroup = fields[2] ? fields[2].trim() : '';
          
          // Domain varsa domain'i kontrol et, yoksa workgroup'u kontrol et
          const targetDomain = domain || workgroup;
          
          return targetDomain.toLowerCase() === 'internet.idb';
        }
      } catch (wmicError) {
        console.warn('WMIC komutu başarısız:', wmicError.message);
        
        // Alternatif yöntem: systeminfo komutu
        try {
          const systeminfoCommand = 'systeminfo | findstr /C:"Domain"';
          const result = execSync(systeminfoCommand, { encoding: 'utf8', timeout: 5000 });
          
          if (result.includes('internet.idb')) {
            return true;
          }
        } catch (systeminfoError) {
          console.warn('SystemInfo komutu başarısız:', systeminfoError.message);
        }
      }
    }
    
    // Linux/Unix ortamında
    else if (os.platform() === 'linux' || os.platform() === 'darwin') {
      try {
        // hostname -d komutu ile domain bilgisini al
        const domainResult = execSync('hostname -d 2>/dev/null || echo ""', { 
          encoding: 'utf8', 
          timeout: 3000 
        }).trim();
        
        if (domainResult && domainResult.toLowerCase() === 'internet.idb') {
          return true;
        }
        
        // /etc/resolv.conf dosyasından domain bilgisini kontrol et
        const { default: fs } = await import('fs');
        if (fs.existsSync('/etc/resolv.conf')) {
          const resolvConf = fs.readFileSync('/etc/resolv.conf', 'utf8');
          const domainMatch = resolvConf.match(/^domain\s+(.+)$/m);
          if (domainMatch && domainMatch[1].toLowerCase() === 'internet.idb') {
            return true;
          }
        }
      } catch (unixError) {
        console.warn('Unix domain kontrolü başarısız:', unixError.message);
      }
    }
    
    return false;
    
  } catch (error) {
    console.error('Domain kontrolü sırasında hata:', error);
    // .NET kodundaki catch bloğundaki mantık: 
    // Hata durumunda network bilgisini kontrol et
    try {
      const { default: os } = await import('os');
      const networkInterfaces = os.networkInterfaces();
      
      // Hostname üzerinden domain bilgisini kontrol et
      const hostname = os.hostname();
      if (hostname.includes('.')) {
        const domain = hostname.split('.').slice(1).join('.');
        return domain.toLowerCase() !== 'internet.idb';
      }
      
      return true; // Hata durumunda true döndür (.NET mantığına uygun)
    } catch (networkError) {
      console.error('Network kontrolü başarısız:', networkError);
      return true;
    }
  }
}

// Tarayıcı ortamı için (istemci tarafı)
// Not: Tarayıcıda sistem bilgilerine erişim güvenlik kısıtlamaları nedeniyle sınırlıdır
async function intraEtkiAlaniBrowser() {
  try {
    // Tarayıcıda mevcut URL'den domain bilgisini al
    const currentDomain = window.location.hostname;
    
    // Eğer localhost veya IP adresi değilse domain kontrolü yap
    if (currentDomain && 
        currentDomain !== 'localhost' && 
        currentDomain !== '127.0.0.1' && 
        !currentDomain.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      
      // Alt domain varsa ana domain'i al
      const domainParts = currentDomain.split('.');
      if (domainParts.length >= 2) {
        const mainDomain = domainParts.slice(-2).join('.');
        return mainDomain.toLowerCase() === 'internet.idb';
      }
    }
    
    // User Agent string'inden domain ipucu arayabilir (güvenilir değil)
    const userAgent = navigator.userAgent;
    if (userAgent.includes('internet.idb')) {
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.warn('Tarayıcıda domain kontrolü başarısız:', error);
    return false;
  }
}

// Express.js middleware olarak kullanım
function intraEtkiAlaniMiddleware() {
  return async (req, res, next) => {
    try {
      // Sunucu tarafında domain kontrolü
      const isIntraDomain = await intraEtkiAlaniNodeJS();
      
      // Request objesine domain bilgisini ekle
      req.isIntraDomain = isIntraDomain;
      req.domainInfo = {
        isInternal: isIntraDomain,
        checkTime: new Date().toISOString()
      };
      
      next();
    } catch (error) {
      console.error('Domain kontrolü middleware hatası:', error);
      req.isIntraDomain = false;
      req.domainInfo = {
        isInternal: false,
        error: error.message,
        checkTime: new Date().toISOString()
      };
      next();
    }
  };
}

// Ortam tespiti ve uygun fonksiyonu seçme
function intraEtkiAlani() {
  if (typeof window !== 'undefined') {
    // Tarayıcı ortamı
    return intraEtkiAlaniBrowser();
  } else if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    // Node.js ortamı
    return intraEtkiAlaniNodeJS();
  } else {
    console.warn('Bilinmeyen JavaScript ortamı');
    return Promise.resolve(false);
  }
}

// Kullanım örnekleri:

// 1. Basit kullanım
/*
intraEtkiAlani().then(result => {
  console.log('İntra domain mu?', result);
  if (result) {
    console.log('Bilgisayar internet.idb domain\'inde');
  } else {
    console.log('Bilgisayar internet.idb domain\'inde değil');
  }
});
*/

// 2. Express.js'te middleware olarak kullanım
/*
const express = require('express');
const app = express();

app.use(intraEtkiAlaniMiddleware());

app.get('/api/domain-check', (req, res) => {
  res.json({
    isIntraDomain: req.isIntraDomain,
    domainInfo: req.domainInfo
  });
});
*/

// 3. Async/await ile kullanım
/*
async function checkDomainAndProceed() {
  try {
    const isIntra = await intraEtkiAlani();
    
    if (isIntra) {
      // İntra domain işlemleri
      console.log('İç ağ işlemleri yapılabilir');
    } else {
      // Dış ağ işlemleri
      console.log('Dış ağ güvenlik önlemleri uygulanacak');
    }
  } catch (error) {
    console.error('Domain kontrolü hatası:', error);
  }
}
*/

// ES6 modül exports
export {
  intraEtkiAlani,
  intraEtkiAlaniNodeJS,
  intraEtkiAlaniBrowser,
  intraEtkiAlaniMiddleware
};

// Default export
export default intraEtkiAlani;