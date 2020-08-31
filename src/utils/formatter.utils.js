function currencyFormatter(cents) {
  let tmp = `${cents}`;
  tmp = tmp.replace(/([0-9]{2})$/g, ',$1');

  if (tmp.length > 6) tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');

  const newValue = tmp.substring(0, tmp.indexOf(','));
  if (newValue === '') {
    cents = tmp.substring(tmp.indexOf(',') + 1);
    cents = cents === '0' ? '00' : cents;

    tmp = `0,${cents}`;
  }

  return `R$ ${tmp}`;
}

function dimensionsFormatter(dimensions) {
  const newDimensions = dimensions;

  Object.entries(newDimensions).forEach((dimension) => {
    if (dimension[1] !== '') {
      newDimensions[dimension[0]] = dimension[1].replace(/,/g, '.');
    }
  });

  return newDimensions;
}

export { currencyFormatter, dimensionsFormatter };
