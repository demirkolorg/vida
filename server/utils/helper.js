const helper = {
  generateId: (HizmetName) => {
    const now = new Date();
    const yil = now.getFullYear();
    const ay = (now.getMonth() + 1).toString().padStart(2, "0"); // Aylar 0-11 arası olduğu için +1
    const gun = now.getDate().toString().padStart(2, "0");
    const saat = now.getHours().toString().padStart(2, "0");
    const dakika = now.getMinutes().toString().padStart(2, "0");
    const saniye = now.getSeconds().toString().padStart(2, "0");

    // process.hrtime.bigint() ile nanosaniye alıp, bunun bir kısmını kullanma
    // Bu, Node.js'in başlatıldığı andan itibaren geçen nanosaniyeyi verir.
    // Daha mutlak bir zaman için Date ile birleştirmek daha doğru olur.
    // Ancak ID'nin son kısmının hızla değişen bir değer olması yeterli.
    const nanoSeconds = process.hrtime.bigint();
    // Nanosaniyenin son 9 hanesini alıp, bunun ilk 7 hanesini kullanabiliriz.
    // Ya da doğrudan nanoSeconds değerinin bir bölümünü alabiliriz.
    // Genellikle, zaman damgasının geri kalanı zaten ana benzersizliği sağlar,
    // nanosaniye kısmı ise aynı saniye içindeki çakışmaları önlemeye yardımcı olur.
    // Nanosaniye değerini string'e çevirip sonundan 7 hane almak daha stabil olabilir.
    // Ya da o anki saniyenin nanosaniye kısmı gibi düşünebiliriz.
    // Ancak process.hrtime() sistemin başlangıcına göre olduğu için, Date ile birleştirmek daha anlamlı.
    // Şimdilik, o anki saniyenin alt birimi gibi davranacak bir parça alalım:
    const nanoPart = (nanoSeconds % 1000000000n)
      .toString()
      .padStart(9, "0")
      .substring(0, 7);
    // Alternatif olarak, sadece process.hrtime.bigint() değerinin tamamını (veya bir kısmını) kullanabilirsiniz,
    // ancak bu ID'yi çok uzatabilir. Sizin isteğiniz 7 hane olduğu için yukarıdaki gibi bir yöntem izleyebiliriz.
    // ÖNEMLİ: process.hrtime() monoton bir saat olduğu için sistem yeniden başladığında sıfırlanır.
    // Bu yüzden ID'nin ana benzersizliği hala Date() kısmından gelmeli. Nano kısmı aynı saniye içindeki
    // çakışmaları engellemek içindir.
    20250603

    return `${HizmetName}${yil}${ay}${gun}${nanoPart}`;
  },
  generateUsername: (email) => {
    if (typeof email !== "string" || !email.includes("@")) {
      throw new Error("Geçerli bir e-posta adresi girin.");
    }

    const username = email.split("@")[0]; // '@' işaretinden önceki kısmı alır
    return username;
  },
  checkPasswordMatch: (currentPassword, currentPassword_confirmation) => {
    if (currentPassword !== currentPassword_confirmation) {
      throw new Error("Şifreler eşleşmiyor");
    }
  },

  checkEmailFormat: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Geçersiz email formatı");
    }
    return true;
  },
  checkPasswordStrength: (password) => {
    // const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!password) {
    //   throw new Error('Şifre boş olamaz.');
    // }

    // if (password.length < 8) {
    //   throw new Error('Şifre en az 8 karakter uzunluğunda olmalıdır.');
    // }

    // if (!PASSWORD_REGEX.test(password)) {
    //   throw new Error('Şifre şunları içermelidir:\n' + '- En az 8 karakter\n' + '- En az bir büyük harf\n' + '- En az bir küçük harf\n' + '- En az bir rakam\n' + '- En az bir özel karakter (@$!%*?&)');
    // }

    return true;
  },

  checkAvatarUrl: (url) => {
    // URL formatı kontrolü (http/https)
    const urlPattern = /^(http|https):\/\/[^ "]+$/;

    if (!url) {
      throw new Error("Avatar URL boş olamaz.");
    }

    if (!urlPattern.test(url)) {
      throw new Error(
        "Geçersiz avatar URL formatı. URL http:// veya https:// ile başlamalıdır."
      );
    }

    // Görsel uzantı kontrolü
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (!imageExtensions.test(url)) {
      throw new Error(
        "Avatar URL geçerli bir görsel dosyası olmalıdır (jpg, jpeg, png, gif, webp)"
      );
    }

    return true;
  },
  checkPhoneNumber: (phone) => {
    const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Geçersiz telefon numarası formatı. Örnek: 5XX1234567");
    }
    return true;
  },
  checkDateFormat: (date) => {
    const dateObj = new Date(date);
    if (dateObj.toString() === "Invalid Date") {
      throw new Error("Geçersiz tarih formatı");
    }
    return true;
  },
  checkFileSize: (size, maxSize = 5) => {
    const maxSizeInBytes = maxSize * 1024 * 1024; // MB to Bytes
    if (size > maxSizeInBytes) {
      throw new Error(`Dosya boyutu ${maxSize}MB'dan büyük olamaz`);
    }
    return true;
  },

  checkPermission: (userRole, requiredRole) => {
    const roles = ["user", "moderator", "admin", "superadmin"];
    const userRoleIndex = roles.indexOf(userRole);
    const requiredRoleIndex = roles.indexOf(requiredRole);

    if (userRoleIndex < requiredRoleIndex) {
      throw new Error("Bu işlem için yetkiniz bulunmamaktadır");
    }
    return true;
  },
  checkTcNumber: (tcno) => {
    if (!/^[0-9]{11}$/.test(tcno)) {
      throw new Error("Geçersiz TC Kimlik Numarası");
    }
    return true;
  },
  checkLanguageCode: (code) => {
    const validCodes = ["tr", "en", "de", "fr"];
    if (!validCodes.includes(code)) {
      throw new Error("Geçersiz dil kodu");
    }
    return true;
  },
  checkSlug: (slug) => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      throw new Error("Geçersiz slug formatı");
    }
    return true;
  },
  checkUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      throw new Error(
        "Kullanıcı adı 3-20 karakter arası olmalı ve sadece harf, rakam ve alt çizgi içerebilir"
      );
    }
    return true;
  },
  checkPrice: (price) => {
    if (isNaN(price) || price < 0) {
      throw new Error("Geçersiz fiyat değeri");
    }
    return true;
  },
  checkAge: (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    if (age < 18) {
      throw new Error("Kullanıcı 18 yaşından küçük olamaz");
    }
    return true;
  },
  checkWorkingHours: (time) => {
    const hour = new Date(time).getHours();
    if (hour < 9 || hour > 18) {
      throw new Error("İşlem sadece 09:00-18:00 saatleri arasında yapılabilir");
    }
    return true;
  },
  checkPostalCode: (code) => {
    const postalRegex = /^[0-9]{5}$/;
    if (!postalRegex.test(code)) {
      throw new Error("Geçersiz posta kodu");
    }
    return true;
  },
  checkIpAddress: (ip) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip)) {
      throw new Error("Geçersiz IP adresi");
    }
    return true;
  },
  checkCreditCard: (cardNumber) => {
    const cardRegex = /^[0-9]{16}$/;
    if (!cardRegex.test(cardNumber)) {
      throw new Error("Geçersiz kredi kartı numarası");
    }
    return true;
  },
  cleanData: (data) => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});
  },
};
export default helper;
