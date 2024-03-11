export const endpoints = {
    login: 'api/v1/authenticate/agent',
    forgetPassword: 'api/v1/agent-user/forgetPassword'
}

export interface ErrorMessage{
    message: string;
}

export interface SuccessMessage{
    message: string;
}