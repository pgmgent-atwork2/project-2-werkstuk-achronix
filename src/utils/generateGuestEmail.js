const generateGuestEmail = (name, lastname) => {
  const sanitizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10);
  const sanitizedLastname = lastname
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10);
  const timestamp = Date.now();
  return `${sanitizedName}${sanitizedLastname}${timestamp}@guest.com`;
};

export default generateGuestEmail;
