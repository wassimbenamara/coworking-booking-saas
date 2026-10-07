interface CreateAuthenticatedTestUserOptions {
    email?: string;
    password?: string;
}
export declare function createAuthenticatedTestUser(options?: CreateAuthenticatedTestUserOptions): Promise<{
    email: string;
    password: string;
    accessToken: string;
}>;
export {};
//# sourceMappingURL=auth-test-helper.d.ts.map