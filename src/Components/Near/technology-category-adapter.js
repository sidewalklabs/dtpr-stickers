const getCategory = (techType, airtableData) => {
  const config = airtableData.techType.find(type => type.name === techType);
  return config && config.iconShortname ? config.iconShortname.split('/').pop() : '';
};

const adapter = {
  getCategory
};

export default adapter;
