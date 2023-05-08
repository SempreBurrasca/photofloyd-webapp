export function getCurrentDateTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const second = now.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export const containsObject = (array, object) => {
  return array.some((item) => JSON.stringify(item) === JSON.stringify(object));
};
