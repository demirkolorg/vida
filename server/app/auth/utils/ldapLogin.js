import ldap from 'ldapjs';
export async function ldapLogin(sicil, parola) {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({ url: 'ldap://IDB-DC03.egmidb.gov.tr' });
    const username = `${sicil}@egmidb.gov.tr`;
    client.bind(username, parola, err => {
      if (err) {
        console.error('LDAP bind hatası:', err.message || err);
        client.unbind();
        return resolve(false);
      }
      client.unbind();
      resolve(true);
    });
  });
}
