export const filterPhotos = (array, filters) => {
  let filteredArray = array;
  if (filters) {
    if (filters.tags && filters.tags.length > 0) {
      filteredArray = filteredArray.filter((photo) => {
        return photo.data.tags.some((tag) => filters.tags.includes(tag));
      });
    }
    if (filters.client && filters.client.length > 0) {
      filteredArray = filteredArray.filter((photo) =>
        filters.client.includes(photo.id)
      );
    }
    if (filters.label) {
      filteredArray = filteredArray.filter((photo) =>
        filters.label.includes(photo.data.label)
      );
    }
  }
  return filteredArray;
};
