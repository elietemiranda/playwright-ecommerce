import { faker } from '@faker-js/faker';

export interface UserData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export function generateUser(): UserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName, provider: 'testmail.com' }),
    password: faker.internet.password({ length: 12 }),
    title: faker.helpers.arrayElement(['Mr', 'Mrs']),
    birthDay: faker.number.int({ min: 1, max: 28 }).toString(),
    birthMonth: faker.number.int({ min: 1, max: 12 }).toString(),
    birthYear: faker.number.int({ min: 1970, max: 2000 }).toString(),
    firstName,
    lastName,
    company: faker.company.name(),
    address: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement(['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.phone.number(),
  };
}

export function generateLoginCredentials() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
  };
}
