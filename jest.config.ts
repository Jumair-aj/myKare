module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/src/(.*)$': '<rootDir>/src/$1',
        '^@/context/(.*)$': '<rootDir>/context/$1',
        '^@/schema/(.*)$': '<rootDir>/schema/$1',
        '^@/dbconfig/(.*)$': '<rootDir>/dbconfig/$1',
      }
    
  };