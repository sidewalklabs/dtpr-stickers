import Airtable from 'airtable'
// @ts-ignore
const airtable = new Airtable({ apiKey: 'keyqsnK4Q2V9wFk6q' })
const base = airtable.base('appjycbdxoV3Nsovw');

// The table names in airtable
export type TableName =
  'Technology Type' |
  'Purpose' |
  'Data Type' |
  'Data Process' |
  'Access' |
  'Storage' |
  'Accountability'

export interface Option {
  name: string;
  icon: string;
  iconShortname: string;
  description: string;
}

export interface AirtableData {
  techType: Option[];
  purpose: Option[];
  dataType: Option[];
  dataProcess: Option[];
  access: Option[];
  storage: Option[];
  accountable: Option[];
}

export async function getAirtableOptionsForTable(tableName: TableName): Promise<Option[]> {
  let options: Array<Option> = []
  return new Promise<Option[]>(function (resolve, reject) {
    base(tableName).select().eachPage(function page(records: Array<any>, fetchNextPage: () => void) {
      records.forEach((record) => {
        const icon = record.get('Icon SVG')
        const iconUrl = icon ? icon[0].url : ''
        const option: Option = {
          name: record.get('Name'),
          icon: iconUrl,
          description: record.get('Description'),
          iconShortname: record.get('Icon Shortname'),
        }
        options.push(option)
      });
      fetchNextPage();
    }, function done(err: Error) {
      if (err) {
        reject(err);
      }
      resolve(options)
    });
  });
}

export async function getAirtableData(): Promise<AirtableData> {
  // return a local cache if it exists, else query Airtable
  const airtableData = sessionStorage.getItem('airtabledata')
  if (airtableData) {
    return JSON.parse(airtableData) as AirtableData
  } else {
    const [techType, purpose, dataType, access, storage, dataProcess, accountable] = await Promise.all([
      await getAirtableOptionsForTable('Technology Type'),
      await getAirtableOptionsForTable('Purpose'),
      await getAirtableOptionsForTable('Data Type'),
      await getAirtableOptionsForTable('Access'),
      await getAirtableOptionsForTable('Storage'),
      await getAirtableOptionsForTable('Data Process'),
      await getAirtableOptionsForTable('Accountability'),
    ])
    const airtableDataObject: AirtableData = { techType, purpose, dataType, access, storage, dataProcess, accountable }

    // cache data for later
    sessionStorage.setItem('airtabledata', JSON.stringify(airtableDataObject));
    return airtableDataObject
  }
}