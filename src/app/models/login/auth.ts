export class Auth { }

export interface AgentCredentials {
    email: string,
    password: string
}

export interface forgotPasswords {
    identifier: string,
    token?: string
}

export interface changePassword {
    oldPassword: string,
    password: string,
    confirmPassword: string
}

export interface resetAgentPassword{
    password: string,
    confirmPassword: string,
    identifier: string
}