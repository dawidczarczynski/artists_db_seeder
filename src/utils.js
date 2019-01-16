const unique_by_title = array => {
  const unique_obj = array.reduce((obj, item) => {
    const name = item.name
      .toLowerCase()
      .replace(/[.*+-?^${}()|[\]\\\s]/g, '');

    obj[`${name}::${typeof item}`] = item;

    return obj;
  }, {});

  return Object
    .keys(unique_obj)
    .map(key => unique_obj[key]);
};

module.exports = { unique_by_title };
