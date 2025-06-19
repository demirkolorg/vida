// domainUtil.js - React/Browser version

export function getDomainName() {
  // Tarayıcıda mevcut sayfanın domain'ini al
  return window.location.hostname;
}

export function getFullDomain() {
  // Protocol + hostname + port
  return window.location.origin;
}

export function getDomainInfo() {
  return {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port,
    origin: window.location.origin,
    host: window.location.host, // hostname + port
  };
}

// Eğer kullanıcının sistem domain'ini almak istiyorsan (sınırlı)
export async function getSystemDomainInfo() {
  try {
    // Bu sadece bazı tarayıcılarda ve HTTPS bağlantılarda çalışabilir
    // Network Information API kullanarak (experimental)
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        // Diğer network bilgileri...
      };
    }
    
    // Alternatif: User Agent üzerinden işletim sistemi bilgisi
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    return {
      userAgent,
      platform,
      cookieEnabled: navigator.cookieEnabled,
      language: navigator.language,
      onLine: navigator.onLine
    };
  } catch (error) {
    return {
      error: 'Sistem bilgisi alınamadı: ' + error.message
    };
  }
}

// React Hook olarak kullanım
import { useState, useEffect } from 'react';

export function useDomainInfo() {
  const [domainInfo, setDomainInfo] = useState(null);

  useEffect(() => {
    const info = getDomainInfo();
    setDomainInfo(info);
  }, []);

  return domainInfo;
}

// Kullanım örneği:
/*
import { getDomainName, useDomainInfo } from './domainUtil';

function MyComponent() {
  const domainInfo = useDomainInfo();
  const currentDomain = getDomainName();

  return (
    <div>
      <p>Mevcut Domain: {currentDomain}</p>
      {domainInfo && (
        <div>
          <p>Hostname: {domainInfo.hostname}</p>
          <p>Protocol: {domainInfo.protocol}</p>
          <p>Origin: {domainInfo.origin}</p>
        </div>
      )}
    </div>
  );
}
*/