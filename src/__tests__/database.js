import fs from 'fs';
import path from 'path';
import Database from '../database';

const RULES = fs.readFileSync(
    path.join(__dirname, 'fixtures/firestore.rules'),
    { encoding: 'utf8' }
);
const DATA = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'fixtures/db.json'))
);
const CREDENTIAL = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../credential.json'))
);

const db = new Database({
    data: DATA,
    rules: RULES,
    credential: CREDENTIAL
});

describe('getDocuments', () => {
    it('should return all documents', () => {
        const docs = db.getDocuments();
        expect(docs.length).toEqual(4);
    });
});

describe('createMockFunctions', () => {
    it('should return exists and get methods for all documents', () => {
        const functions = db.createMockFunctions();
        expect(functions.length).toEqual(8);
    });
});

describe('testRules', () => {
    beforeAll(async () => {
        await db.authorize();
    });

    it('reject when rules', async () => {
        const result = await db.testRules({
            expectation: 'ALLOW',
            request: {
                method: 'get',
                path: '/databases/(default)/documents/users/userA'
            }
        });
        expect(result.state).toBe('SUCCESS');
    });
});
