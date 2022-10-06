import Loadable from 'react-loadable';
import Loading from 'dan-components/Loading';

export const BlankPage = Loadable({
  loader: () => import('./Pages/BlankPage'),
  loading: Loading
});
export const DashboardPage = Loadable({
  loader: () => import('./Pages/Dashboard'),
  loading: Loading
});
export const Form = Loadable({
  loader: () => import('./Pages/Forms/ReduxForm'),
  loading: Loading
});
export const Table = Loadable({
  loader: () => import('./Pages/Table/BasicTable'),
  loading: Loading
});
export const Login = Loadable({
  loader: () => import('./Pages/Users/Login'),
  loading: Loading
});
export const LoginDedicated = Loadable({
  loader: () => import('./Pages/Standalone/LoginDedicated'),
  loading: Loading
});
export const Register = Loadable({
  loader: () => import('./Pages/Users/Register'),
  loading: Loading
});
export const ResetPassword = Loadable({
  loader: () => import('../../transversal-administration/containers/Pages/LeftMenu/Administration/ResetPassword'),
  loading: Loading
});
export const ForgetPassword = Loadable({
  loader: () => import('./Pages/Users/forgetPassword'),
  loading: Loading
});
export const NotFound = Loadable({
  loader: () => import('./NotFound/NotFound'),
  loading: Loading
});
export const NotFoundDedicated = Loadable({
  loader: () => import('./Pages/Standalone/NotFoundDedicated'),
  loading: Loading
});
export const Error = Loadable({
  loader: () => import('./Pages/Error'),
  loading: Loading
});
export const Maintenance = Loadable({
  loader: () => import('./Pages/Maintenance'),
  loading: Loading
});
export const ComingSoon = Loadable({
  loader: () => import('./Pages/ComingSoon'),
  loading: Loading
});
export const Parent = Loadable({
  loader: () => import('./Parent'),
  loading: Loading
});
export const Clients = Loadable({
  loader: () => import('./Pages/Clients'),
  loading: Loading
});
export const AddClients = Loadable({
  loader: () => import('./Pages/Clients/addClient'),
  loading: Loading
});
export const AddContacts = Loadable({
  loader: () => import('./Pages/Contact/addContact'),
  loading: Loading
});
export const Companies = Loadable({
  loader: () => import('./Pages/Companies'),
  loading: Loading
});
export const AddCompany = Loadable({
  loader: () => import('./Pages/Companies/addCompany'),
  loading: Loading
});
export const Sectors = Loadable({
  loader: () => import('./Pages/Sectors'),
  loading: Loading
});
export const SectorsCompany = Loadable({
  loader: () => import('./Pages/sectorsCompany'),
  loading: Loading
});
export const CivilityTitle = Loadable({
  loader: () => import('./Pages/civilityTitle'),
  loading: Loading
});
export const WelcomeCommercial = Loadable({
  loader: () => import('./Pages/Welcome/WelcomePage'),
  loading: Loading
});
export const AddSector = Loadable({
  loader: () => import('./Pages/sectorsCompany/addSector'),
  loading: Loading
});
export const Areas = Loadable({
  loader: () => import('./Pages/Areas'),
  loading: Loading
});
export const AddArea = Loadable({
  loader: () => import('./Pages/Areas/addArea'),
  loading: Loading
});
export const SelectionTypeEvaluation = Loadable({
  loader: () => import('./Pages/SelectionTypeEvaluation'),
  loading: Loading
});
export const AddSelectionTypeEvaluation = Loadable({
  loader: () => import('./Pages/SelectionTypeEvaluation/addSelectionType'),
  loading: Loading
});
export const SelectionProcessInformation = Loadable({
  loader: () => import('./Pages/SelectionProcessInformation'),
  loading: Loading
});
export const AddSelectionProcessInformation = Loadable({
  loader: () => import('./Pages/SelectionProcessInformation/addSelectionProcess'),
  loading: Loading
});
export const FunctionalStructure = Loadable({
  loader: () => import('./Pages/FunctionalStructure'),
  loading: Loading
});
export const AddFunctionalLevel = Loadable({
  loader: () => import('./Pages/FunctionalStructure/addLevel'),
  loading: Loading
});
export const AdministrativeStructure = Loadable({
  loader: () => import('./Pages/AdministrativeStructure'),
  loading: Loading
});
export const AddAdministrativeLevel = Loadable({
  loader: () => import('./Pages/AdministrativeStructure/addLevel'),
  loading: Loading
});
export const ContractType = Loadable({
  loader: () => import('./Pages/ContractType'),
  loading: Loading
});
export const AddContractType = Loadable({
  loader: () => import('./Pages/ContractType/addContractType'),
  loading: Loading
});
export const LegalCategoryType = Loadable({
  loader: () => import('./Pages/LegalCategoryType'),
  loading: Loading
});
export const AddLegalCategoryType = Loadable({
  loader: () => import('./Pages/LegalCategoryType/addLegalCategoryType'),
  loading: Loading
});
export const LocalBankHoliday = Loadable({
  loader: () => import('./Pages/LocalBankHoliday'),
  loading: Loading
});
export const AddLocalBankHoliday = Loadable({
  loader: () => import('./Pages/LocalBankHoliday/addLocalBankHoliday'),
  loading: Loading
});
export const ContractModel = Loadable({
  loader: () => import('./Pages/ContractModel'),
  loading: Loading
});
export const AddContractModel = Loadable({
  loader: () => import('./Pages/ContractModel/addContractModel'),
  loading: Loading
});
export const AbsenceType = Loadable({
  loader: () => import('./Pages/AbsenceType'),
  loading: Loading
});
export const AddAbsenceType = Loadable({
  loader: () => import('./Pages/AbsenceType/addAbsenceType'),
  loading: Loading
});
export const AbsenceRequest = Loadable({
  loader: () => import('./Pages/AbsenceRequest'),
  loading: Loading
});
export const AddAbsenceRequest = Loadable({
  loader: () => import('./Pages/AbsenceRequest/addAbsenceRequest'),
  loading: Loading
});
export const AbsenceConsult = Loadable({
  loader: () => import('./Pages/AbsenceConsult'),
  loading: Loading
});
/* export const CountryConfig = Loadable({
  loader: () => import('./Pages/Configurations/Country'),
  loading: Loading
}); */
export const Assignments = Loadable({
  loader: () => import('./Pages/Assignments'),
  loading: Loading
});
/* export const AddCountry = Loadable({
  loader: () => import('./Pages/Configurations/Country/addCountry'),
  loading: Loading
}); */
export const CommercialAssignment = Loadable({
  loader: () => import('./Pages/Assignments/Commercial'),
  loading: Loading
});
export const UnauthorizedDedicated = Loadable({
  loader: () => import('./Pages/Standalone/UnauthorizedDedicated'),
  loading: Loading,
});
export const People = Loadable({
  loader: () => import('./Pages/People/index'),
  loading: Loading
});
export const AddWorkers = Loadable({
  loader: () => import('./Pages/People/addWorker'),
  loading: Loading
});
export const Staff = Loadable({
  loader: () => import('./Pages/Staff/index'),
  loading: Loading
});
export const AddStaff = Loadable({
  loader: () => import('./Pages/Staff/addStaff'),
  loading: Loading
});
export const Operations = Loadable({
  loader: () => import('./Pages/Assignments/Operations/index'),
  loading: Loading
});
export const OperationsAssignment = Loadable({
  loader: () => import('./Pages/Assignments/Operations/addOperation'),
  loading: Loading
});
// Add by Aymane
export const CommercialOperation = Loadable({
  loader: () => import('./Pages/CommercialOperation/commercialOperationList'),
  loading: Loading
});
// Add by Aymane
export const CommercialAction = Loadable({
  loader: () => import('./Pages/CommercialAction/index'),
  loading: Loading
});
// Add by Aymane
export const AddCommercialAction = Loadable({
  loader: () => import('./Pages/CommercialAction/addCommercialActions'),
  loading: Loading
});
// Add by Aymane
export const AddCommercialOperation = Loadable({
  loader: () => import('./Pages/CommercialOperation/addCommercialOperation'),
  loading: Loading
});
// Add by Aymane
export const CommercialActionHistory = Loadable({
  loader: () => import('./Pages/CommercialAction/commercialActionHistory'),
  loading: Loading
});
// Add by Aymane
export const ActionType = Loadable({
  loader: () => import('./Pages/ActionType/index'),
  loading: Loading
});
// Add by Aymane
export const AddActionType = Loadable({
  loader: () => import('./Pages/ActionType/addTypeOfAction'),
  loading: Loading
});
// Add by Miguel
export const DocumentManager = Loadable({
  loader: () => import('./Pages/CommercialDocumentManager/DocumentManager'),
  loading: Loading
});
// Add by Aymane
export const FinancialCompany = Loadable({
  loader: () => import('./Pages/FinancialSystem/Company'),
  loading: Loading
});
// Add by Aymane
export const FinancialContract = Loadable({
  loader: () => import('./Pages/FinancialSystem/Contract'),
  loading: Loading
});
// Add by Aymane
export const AddContract = Loadable({
  loader: () => import('./Pages/FinancialSystem/Contract/AddContract'),
  loading: Loading
});
// Add by Aymane
export const AddFinancialCompany = Loadable({
  loader: () => import('./Pages/FinancialSystem/Company/AddFinancialCompany'),
  loading: Loading
});
export const ClientContact = Loadable({
  loader: () => import('./Pages/Contact'),
  loading: Loading
});
export const ServiceTypes = Loadable({
  loader: () => import('./Pages/ServiceType'),
  loading: Loading
});
export const City = Loadable({
  loader: () => import('./Pages/City'),
  loading: Loading
});
export const State = Loadable({
  loader: () => import('./Pages/State/index'),
  loading: Loading
});
// Add by Aymane
export const ContractStatus = Loadable({
  loader: () => import('./Pages/FinancialSystem/ContractStatus'),
  loading: Loading
});
// Add by Aymane
export const AddContractStatus = Loadable({
  loader: () => import('./Pages/FinancialSystem/ContractStatus/addStatus'),
  loading: Loading
});
export const StatusOfCommercialOperation = Loadable({
  loader: () => import('./Pages/StatusOfCommercialOperation'),
  loading: Loading
});
// Add by Aymane
export const Billing = Loadable({
  loader: () => import('./Pages/FinancialSystem/Billing'),
  loading: Loading
});
// Add by Aymane
export const AddBilling = Loadable({
  loader: () => import('./Pages/FinancialSystem/Billing/addBilling'),
  loading: Loading
});
// Add by Aymane
export const IVA = Loadable({
  loader: () => import('./Pages/FinancialSystem/IVA'),
  loading: Loading
});
// Add by Aymane
export const AddIVA = Loadable({
  loader: () => import('./Pages/FinancialSystem/IVA/addIVA'),
  loading: Loading
});
// Add by Aymane
export const ContactByOperationStatus = Loadable({
  loader: () => import('./Pages/ContactByOperationStatus'),
  loading: Loading
});
// Add by Aymane
export const Currency = Loadable({
  loader: () => import('./Pages/FinancialSystem/CurrencyManagement'),
  loading: Loading
});
// Add by Aymane
export const AddCurrency = Loadable({
  loader: () => import('./Pages/FinancialSystem/CurrencyManagement/addCurrency'),
  loading: Loading
});
// Add by Aymane
export const TypeOfCurrency = Loadable({
  loader: () => import('./Pages/FinancialSystem/TypeOfCurrency'),
  loading: Loading
});
// Add by Aymane
export const AddTypeOfCurrency = Loadable({
  loader: () => import('./Pages/FinancialSystem/TypeOfCurrency/addTypeOfCurrency'),
  loading: Loading
});
// Add by Aymane
export const Retention = Loadable({
  loader: () => import('./Pages/FinancialSystem/Retentions'),
  loading: Loading
});
// Add by Aymane
export const AddRetention = Loadable({
  loader: () => import('./Pages/FinancialSystem/Retentions/addRetention'),
  loading: Loading
});
// Add by Aymane
export const EconomicStaff = Loadable({
  loader: () => import('./Pages/FinancialSystem/StaffEconomicManagement'),
  loading: Loading
});
export const Role = Loadable({
  loader: () => import('../../transversal-administration/containers/Pages/LeftMenu/Administration/Role'),
  loading: Loading
});
/* export const ResetPassword = Loadable({
  loader: () => import('../../transversal-administration/containers/Pages/LeftMenu/Administration/resetPassword'),
  loading: Loading
}); */
// Add by Aymane
export const AddEconomicStaff = Loadable({
  loader: () => import('./Pages/FinancialSystem/StaffEconomicManagement/addEconomicStaff'),
  loading: Loading
});
export const User = Loadable({
  loader: () => import('../../transversal-administration/containers/Pages/LeftMenu/Administration/User'),
  loading: Loading
});
export const Logs = Loadable({
  loader: () => import('../../transversal-administration/containers/Pages/LeftMenu/Administration/Logs'),
  loading: Loading
});
// Add by Aymane
export const EconomicStaffsPayment = Loadable({
  loader: () => import('./Pages/FinancialSystem/EconomicStaffPayments'),
  loading: Loading
});
export const RoleActions = Loadable({
  loader: () => import('../../transversal-administration/containers/Pages/LeftMenu/Administration/RoleActions'),
  loading: Loading
});
// Add by Aymane
export const SupplierType = Loadable({
  loader: () => import('./Pages/FinancialSystem/SuppliersType'),
  loading: Loading
});
// Add by Aymane
export const AddSupplierType = Loadable({
  loader: () => import('./Pages/FinancialSystem/SuppliersType/addSuppliersType'),
  loading: Loading
});
// Add by Aymane
export const ExternalSupplier = Loadable({
  loader: () => import('./Pages/FinancialSystem/ExternalSuppliers'),
  loading: Loading
});
// Add by Aymane
export const AddExternalSupplier = Loadable({
  loader: () => import('./Pages/FinancialSystem/ExternalSuppliers/addExternalSupplier'),
  loading: Loading
});
// Add by Aymane
export const SuppliersContract = Loadable({
  loader: () => import('./Pages/FinancialSystem/SuppliersContract'),
  loading: Loading
});
// Add by Aymane
export const AddSuppliersContract = Loadable({
  loader: () => import('./Pages/FinancialSystem/SuppliersContract/addSuppliersContract'),
  loading: Loading
});
// Add by Aymane
export const SuppliersPayment = Loadable({
  loader: () => import('./Pages/FinancialSystem/SuppliersPayment'),
  loading: Loading
});
// Add by Aymane
export const AddSuppliersPayment = Loadable({
  loader: () => import('./Pages/FinancialSystem/SuppliersPayment/addSuppliersPayment'),
  loading: Loading
});
// Add by Aymane
export const PurchaseOrderAcceptance = Loadable({
  loader: () => import('./Pages/FinancialSystem/PurchaseOrderAcceptance'),
  loading: Loading
});
// Add by Aymane
export const AddPurchaseOrderAcceptance = Loadable({
  loader: () => import('./Pages/FinancialSystem/PurchaseOrderAcceptance/addPurchaseOrder'),
  loading: Loading
});
// Add by Aymane
export const PurchaseOrder = Loadable({
  loader: () => import('./Pages/FinancialSystem/PurchaseOrderManagement'),
  loading: Loading
});
// Add by Aymane
export const AddPurchaseOrder = Loadable({
  loader: () => import('./Pages/FinancialSystem/PurchaseOrderManagement/addPurchaseOrder'),
  loading: Loading
});
export const ExpensesRecord = Loadable({
  loader: () => import('./Pages/FinancialSystem/Expenses/ExpensesRecord'),
  loading: Loading
});

// Add by Miguel
export const ExpensesManagement = Loadable({
  loader: () => import('./Pages/FinancialSystem/Expenses/ExpensesManagement'),
  loading: Loading
});
// Add by Miguel
export const TravelRequest = Loadable({
  loader: () => import('./Pages/FinancialSystem/Travels/TravelRequest'),
  loading: Loading
});
// Add by Miguel
export const TravelManagement = Loadable({
  loader: () => import('./Pages/FinancialSystem/Travels/TravelManagement'),
  loading: Loading
});

// Add by Miguel
export const BusinessExpenseTypes = Loadable({
  loader: () => import('./Pages/FinancialSystem/BusinessExpenseType/BusinessExpenseTypes'),
  loading: Loading
});

// Add by Miguel
export const RequestStatus = Loadable({
  loader: () => import('./Pages/FinancialSystem/RequestStatus/RequestStatus'),
  loading: Loading
});

// Add by Miguel
export const TravelRequestEmailAddress = Loadable({
  loader: () => import('./Pages/FinancialSystem/TravelRequestEmailAddress/TravelRequestEmailAddress'),
  loading: Loading
});

// Add by Miguel
export const StaffExpenseTypes = Loadable({
  loader: () => import('./Pages/FinancialSystem/StaffExpenseType/StaffExpenseTypes'),
  loading: Loading
});

// Add by Miguel
export const PersonTypes = Loadable({
  loader: () => import('./Pages/FinancialSystem/PersonTypes/PersonTypes'),
  loading: Loading
});

// Add by Miguel
export const VoucherTypes = Loadable({
  loader: () => import('./Pages/FinancialSystem/VoucherTypes/VoucherTypes'),
  loading: Loading
});

// Add by Miguel
export const ExpenseStatus = Loadable({
  loader: () => import('./Pages/FinancialSystem/ExpenseStatus/ExpenseStatus'),
  loading: Loading
});

// Add by Miguel
export const ExpenseEmailAddress = Loadable({
  loader: () => import('./Pages/FinancialSystem/ExpenseEmailAddress/ExpenseEmailAddress'),
  loading: Loading
});

// Add by Miguel
export const StaffAssignment = Loadable({
  loader: () => import('./Pages/OperativeSystem/StaffAssignment/StaffAssignment'),
  loading: Loading
});

// Add by Miguel
export const WeeklyReport = Loadable({
  loader: () => import('./Pages/OperativeSystem/WeeklyReport/WeeklyReport'),
  loading: Loading
});

// Add by Miguel
export const AssignmentTypes = Loadable({
  loader: () => import('./Pages/OperativeSystem/BasicTables/AssignmentTypes'),
  loading: Loading
});

// Add by Miguel
export const WeeklyReportConfig = Loadable({
  loader: () => import('./Pages/OperativeSystem/Configurations/WeeklyReportConfig'),
  loading: Loading
});

// Add by Miguel
export const DefaultSentence = Loadable({
  loader: () => import('../../transversal-translation/containers/Pages/LeftMenu/Translation/DefaultSentence'),
  loading: Loading
});

// Add by Miguel
export const TranslationSentence = Loadable({
  loader: () => import('../../transversal-translation/containers/Pages/LeftMenu/Translation/TranslationSentence'),
  loading: Loading
});
