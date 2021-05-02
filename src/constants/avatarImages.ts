function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

/* ====================
   random avatar images
 ==================== */

const avatars = [
  'https://www.monteirolobato.edu.br/public/assets/admin/images/avatars/avatar11_big@2x.png',
  'https://www.monteirolobato.edu.br/public/assets/admin/images/avatars/avatar10_big@2x.png',
  'https://www.monteirolobato.edu.br/public/assets/admin/images/avatars/avatar9_big@2x.png',
  'https://www.monteirolobato.edu.br/public/assets/admin/images/avatars/avatar_notif.png'
];

export const getRandomAvatar = () => avatars[getRandomInt(avatars.length)];