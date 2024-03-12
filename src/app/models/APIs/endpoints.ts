export const endpoints = {
    login: 'api/v1/authenticate/agent',
    forgetPassword: 'api/v1/agent-user/forgetPassword',
    validateForgetPasswordToken: 'api/v1/agent-user/validateForgetPasswordToken',
    changePassword : 'api/v1/agent-user/changePassword'
}

export interface ErrorMessage{
    message: string;
}

export interface SuccessMessage{
    message: string;
}