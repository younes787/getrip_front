

export const formatDate = (date?: Date) => {
  // if (!date) return '';

  const d = new Date(date ?? new Date());
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const day = `0${d.getDate()}`.slice(-2);
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
