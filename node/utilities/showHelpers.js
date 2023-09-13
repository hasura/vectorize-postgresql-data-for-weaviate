const showColumns = (fields) => {
  const columns = [];
  fields.forEach((field) => {
    columns.push({
      column_name: field.column_name,
      data_type: field.data_type,
    });
  });
  return columns;
};

export { showColumns };
