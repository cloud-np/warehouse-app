export const postcodeValidator = (postcode) => {
    const regex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
    return regex.test(postcode);
}