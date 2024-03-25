export const endpoints = {
    //Auth
    login: 'api/v1/authenticate/agent',
    forgetPassword: 'api/v1/agent-user/forgetPassword',
    validateForgetPasswordToken: 'api/v1/agent-user/validateForgetPasswordToken',
    changePassword : 'api/v1/agent-user/changePassword',
    getUserDetails: 'api/v1/agent-user',
    logoutUser: 'api/v1/logout',
    refreshToken: 'api/v1/refresh',

    // Onboarding
    verificationDetails: 'api/v1/onboarding/verification',
    personalDetails: 'api/v1/onboarding/personalDetails',
    residentialDetails: 'api/v1/onboarding/residentialDetails',
    educationDetails: 'api/v1/onboarding/educationalDetails',
    healthDetails: 'api/v1/onboarding/healthDetails',
    financialDetails: 'api/v1/onboarding/financialDetails',
    nextOfKinDetails: 'api/v1/onboarding/nextOfKinDetails',
    employmentDetails: 'api/v1/onboarding/employmentDetails',
    otherDetails: 'api/v1/onboarding/otherDetails',
    maritalDetails: 'api/v1/onboarding/maritalDetails',

    //Get All Beneficiaries Onboarded
    getAllBeneficiaries: 'api/v1/beneficiary/getBeneficiariesByLoggedInAgent',
    getBeneficiaryProfile: 'api/v1/beneficiary/getBeneficiary',
    getIncompleteBeneficiaries: 'api/v1/beneficiary/getIncompleteOnboardedBeneficiaries'
}

export interface ErrorMessage{
    message: string;
}

export interface SuccessMessage{
    message: string;
}