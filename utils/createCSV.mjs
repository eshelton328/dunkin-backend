export const createCSV = (headers, body) => {
    const csvString = [
        headers,
        ...body.map(obj => Object.values(obj))
      ]
      .map(row => row.join(','))
      .join('\n');
      return csvString;
}