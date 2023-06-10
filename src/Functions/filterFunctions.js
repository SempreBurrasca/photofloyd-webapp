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
    if (filters.data) {
      const startDate = new Date(
        filters.data.start.year,
        filters.data.start.month - 1,
        filters.data.start.day
      );
      const endDate = new Date(
        filters.data.end.year,
        filters.data.end.month - 1,
        filters.data.end.day
      );
      filteredArray = filteredArray.filter((photo) => {
        const photoDate = new Date(photo.data.lastModified);
        console.log(photo.data.lastModified,photoDate, startDate,endDate)
        return photoDate >= startDate && photoDate <= endDate;
      });
    }
  }
  return filteredArray;
};
