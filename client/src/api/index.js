import axios from 'axios';

const _serverUrl = 'http://localhost:1007';

export const axiosInstance = async (method, endpoint, data) => {
  let token = null;
  const authDataString = localStorage.getItem('vida-auth'); // TEK ANAHTAR
  if (authDataString) {
    try {
      const authData = JSON.parse(authDataString);
      token = authData?.accessToken;
    } catch (e) {
      console.error('Failed to parse auth data from localStorage', e);
      localStorage.removeItem('vida-auth'); // Bozuksa temizle
    }
  }

  try {
    const response = await axios({
      baseURL: _serverUrl,
      method,
      url: endpoint,
      data, // Eğer data undefined ise axios bunu görmezden gelir
      headers: {
        ...(token && { authorization: `Bearer ${token}` }),
      },
    });
    return response; // Başarılı yanıtı döndür
  } catch (error) {
    // Hata yönetimi burada daha kapsamlı olabilir.
    // Örneğin, hatayı yeniden fırlatabilir veya belirli bir formatta döndürebilirsiniz.
    console.error('API call failed:', error.response || error.message);
    throw error; // Çağıran fonksiyona hatayı iletmek iyi bir pratiktir.
  }
};
