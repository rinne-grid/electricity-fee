export const getDays = () => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
};
