/* eslint-disable */
import { faker } from '@faker-js/faker';

export const roles = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    name: faker.name.fullName(),
    description: faker.lorem.sentence(),
    permissions: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.lorem.words(2)),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
}));