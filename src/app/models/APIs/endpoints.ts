export const endpoints = {
  //Auth
  login: 'api/v1/authenticate/agent',
  forgetPassword: 'api/v1/agent-user/forgetPassword',
  validateForgetPasswordToken: 'api/v1/agent-user/validateForgetPasswordToken',
  changePassword: 'api/v1/agent-user/changePassword',
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
  getIncompleteBeneficiaries:
    'api/v1/beneficiary/getIncompleteOnboardedBeneficiaries',
  getFilteredBeneficiaries: 'api/v1/beneficiary/getFilteredBeneficiaries',
  getQualityRating: 'api/v1/enums/qualityRatings',
  getWards: 'api/v1/residency/wardList/',
  getDistanceRanges: 'api/v1/enums/distanceRanges',

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
  periods: 'api/v1/enums/periods',
  engagements: 'api/v1/enums/engagements',
  waterSources: 'api/v1/enums/waterSources',
  transportationModes: 'api/v1/enums/transportationModes',
  trainingTypes: 'api/v1/enums/trainingTypes',
  ratings: 'api/v1/enums/ratings',
  politicalParties: 'api/v1/enums/politicalParties',
  plans: 'api/v1/enums/plans',
  palliativeTypes: 'api/v1/enums/palliativeTypes',
  palliativeStatus: 'api/v1/enums/palliativeStatus',
  occupationTypes: 'api/v1/enums/occupationTypes',
  publicServiceCategory: 'api/v1/enums/publicServiceCategory',
  institutionNames: 'api/v1/residency/institutionList',
  maritalStatus: 'api/v1/enums/maritalStatus',
  gender: 'api/v1/enums/gender',
  formStage: 'api/v1/enums/formStage',
  benefitPartners: 'api/v1/enums/benefitPartners',
  benefitCategories: 'api/v1/enums/benefitCategories',
  ageRange: 'api/v1/enums/ageRange',
  civilServiceCategory: 'api/v1/enums/civilServiceCategory',
  HourRanges: 'api/v1/enums/HourRanges',
  cityList: 'api/v1/residency/cityList/Kwara',
  stateMinistries: 'api/v1/civil-service/state-ministries-list/Kwara',
  agencyList: 'api/v1/civil-service/agencyList/',

  //dashboard statistics

  dashboardStats: 'api/v1/dashboard/agent/statistics',

  // fingerprint
  fingerPrintSkip: 'api/v1/fingerprints/',
};

export interface ErrorMessage {
  message: string;
}

export interface SuccessMessage {
  message: string;
}
