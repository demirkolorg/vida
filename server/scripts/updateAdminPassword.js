// server/scripts/updateAdminPassword.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    const adminSicil = '999999';
    const newPassword = '999999';
    const saltRounds = 12;
    
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const updatedUser = await prisma.personel.update({
      where: { sicil: adminSicil },
      data: { parola: hashedPassword }
    });
    
    console.log('Admin parolası başarıyla güncellendi:', updatedUser.sicil);
  } catch (error) {
    console.error('Parola güncelleme hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();