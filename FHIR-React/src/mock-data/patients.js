export const joeBlowId = 1234567891234567;

export const joeBlow = {
  id: joeBlowId,
  name: [
    {
      given: ['Joe', 'Moe'],
      family: ['Blow'],
    },
  ],
  birthDate: '1884-04-21',
  gender: 'Male',
  deceased: 'true',
  telecom: [
    {
      use: 'Personal',
      system: 'Mobile',
      value: '0482994185',
    },
    {
      use: 'Business',
      system: 'Email',
      value: 'joemoeblow@gmail.com',
    },
  ],
  identifier: [
    {
      type: {
        coding: [
          {
            display: 'Medicare',
          },
        ],
      },
      value: '000000001',
    },
    {
      type: {
        coding: [
          {
            display: "Driver's License",
          },
        ],
      },
      value: '000000002',
    },
  ],
  communication: [
    {
      language: {
        coding: [
          {
            display: 'English',
          },
        ],
      },
    },
    {
      language: {
        coding: [
          {
            display: 'Latin',
          },
        ],
      },
    },
  ],
  address: { address: '105 Lowe St, Slow Hill 4111, QLD Australia' }, // Will update to actuall address format
  active: 'false',
  maritalStatus: 'Married', // Will update to actual format
};
