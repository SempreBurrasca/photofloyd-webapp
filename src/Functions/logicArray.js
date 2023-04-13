//funzione di filter, restituisce array con elementi unici
export function onlyUnique(value, index, array) {
  return array.indexOf(value.id) === index;
}
//funzione di generazione id randomico
export function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}