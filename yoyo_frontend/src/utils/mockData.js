import Faker from 'faker';

export const mockHotels = new Array(10).fill(0).map(() => ({
  id: Faker.random.uuid(),
  name: Faker.company.companyName(),
  location: Faker.address.city(),
  imageUrl: Faker.image.imageUrl(),
  rating: Faker.random.number({ min: 1, max: 5 }),
}));