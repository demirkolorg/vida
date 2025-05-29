
import { PrismaClient } from '@prisma/client';
import { AuditStatusEnum } from '@prisma/client';

const prisma = new PrismaClient();


async function defaultKonum() {
  try {


    const createPayload = {
            id: yeniId,
            ad: data.ad,
            status: AuditStatusEnum.Aktif,
            createdById: null,
          };
          if (data.aciklama !== undefined) createPayload.aciklama = data.aciklama;
    

    payload:{}
    const updatedUser = await prisma.konum.create({
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
defaultKonum();