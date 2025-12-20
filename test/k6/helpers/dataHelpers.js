import faker from 'k6/x/faker';

export function generateUsername() {
    const username = faker.person.firstName();
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    return `${username}-${id}`;
}

export function generatePassword() {
    return faker.internet.password();
}

export function generateNoteData() {
    const title = faker.word.word();
    const content = faker.word.paragraph();
    return {
        title: title,
        content: content
    };
}