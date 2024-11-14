// jest.config.js
module.exports= {
    // Specifies the root directory that Jest should scan for tests and modules.
    rootDir: './',

    // The glob patterns Jest uses to detect test files.
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

    // The test environment that will be used for testing.
    testEnvironment: 'node',

    // Automatically clear mock calls and instances between every test.
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test.
    collectCoverage: true,

    // The directory where Jest should output its coverage files.
    coverageDirectory: 'coverage',

    // The file extensions Jest will look for when resolving modules.
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

    // Specify the global setup and teardown scripts.
    setupFilesAfterEnv: [],

    transform:  {},
    // Coverage thresholds for failure
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};