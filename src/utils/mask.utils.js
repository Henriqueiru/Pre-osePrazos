function removeMask(value) {
  return value.replace(/\D/g, '');
}

function currencyMask(value) {
  let v = value.replace(/\D/g, '');
  v = `${(v / 100).toFixed(2)}`;
  v = v.replace('.', ',');
  v = v.replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,');
  v = v.replace(/(\d)(\d{3}),/g, '$1.$2,');

  return `R$ ${v}`;
}

function cepMask(CEP) {
  let newCEP = removeMask(CEP);

  newCEP = newCEP.replace(/^0+/, '');
  newCEP = Array(8 - newCEP.toString().length + 1).join('0') + newCEP;
  newCEP = newCEP.replace(/^(\d{5})(\d)/, '$1-$2');

  if (newCEP !== '00000-000') {
    return newCEP.substr(0, 9);
  }

  return '';
}

function dimensionsMask(value) {
  value += '';
  value = parseInt(value.replace(/[\D]+/g, ''), 10);

  if (value) {
    value += '';
    value = value.replace(/([0-9]{1})$/g, ',$1');

    if (value.length > 6) {
      value = value.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
    }
  } else {
    value = '';
  }

  return value;
}

export { currencyMask, removeMask, cepMask, dimensionsMask };
