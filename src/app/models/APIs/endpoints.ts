export const endpoints = {
    //Auth
    login: 'api/v1/authenticate/agent',
    forgetPassword: 'api/v1/agent-user/forgetPassword',
    validateForgetPasswordToken: 'api/v1/agent-user/validateForgetPasswordToken',
    changePassword : 'api/v1/agent-user/changePassword',
    resetPassword: 'api/v1/agent-user/resetPassword',
    getUserDetails: 'api/v1/agent-user',
    logoutUser: 'api/v1/logout',
    refreshToken: 'api/v1/refresh',

    // Onboarding
    verifyNIN: 'api/v1/onboarding/verifyNIN',
    verificationDetails: 'api/v1/onboarding/verification',
    personalDetails: 'api/v1/onboarding/personalDetails',
    verifyOTP: 'api/v1/otp/agent/generate',
    verificationOTP: 'api/v1/onboarding/verification',
    residentialDetails: 'api/v1/onboarding/residentialDetails',
    educationDetails: 'api/v1/onboarding/educationalDetails',
    healthDetails: 'api/v1/onboarding/healthDetails',
    financialDetails: 'api/v1/onboarding/financialDetails',
    nextOfKinDetails: 'api/v1/onboarding/nextOfKinDetails',
    employmentDetails: 'api/v1/onboarding/employmentDetails',
    otherDetails: 'api/v1/onboarding/otherDetails',
    maritalDetails: 'api/v1/onboarding/maritalDetails',
    occupataion: 'api/v1/onboarding/occupationDetails',
    onboardingSuccesfull: 'api/v1/onboarding/submitBeneficiary',

    //Get All Beneficiaries Onboarded
    getAllBeneficiaries: 'api/v1/beneficiary/getBeneficiariesByLoggedInAgent',
    getBeneficiaryProfile: 'api/v1/beneficiary/getBeneficiary',
    getIncompleteBeneficiaries: 'api/v1/beneficiary/getIncompleteOnboardedBeneficiaries',
    getFilteredBeneficiaries: 'api/v1/beneficiary/getFilteredBeneficiaries',


    //enums

    religion: 'api/v1/enums/religion',
    education: 'api/v1/enums/educationLevels',
    educationSponsor: 'api/v1/enums/educationFunding',
    healthConditions: 'api/v1/enums/healthConditions',
    healthAilments: 'api/v1/enums/healthAilments',
    disabilityTypes: 'api/v1/enums/disabilityTypes',
    moneyRange: 'api/v1/enums/moneyRange',
    aidType: 'api/v1/enums/aidType',
    relationship: 'api/v1/enums/relationship',
    employment: 'api/v1/enums/employmentStatus',
    businessNature: 'api/v1/enums/businessNature',
    diplomaTypes: 'api/v1/enums/diplomaTypes',
    cadres: 'api/v1/enums/cadres',
    transportTypes: 'api/v1/enums/transportMeans',
    criminalTypes: 'api/v1/enums/crimeType',
    reportRanges: 'api/v1/enums/reportRanges',

    //dashboard statistics
    
    dashboardStats: 'api/v1/dashboard/agent/statistics'
}

export interface ErrorMessage{
    message: string;
}

export interface SuccessMessage{
    message: string;
}