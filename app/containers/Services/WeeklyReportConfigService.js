import axios from 'axios';
import { API } from '../../config/apiUrl';

class WeeklyReportConfigService {
getEmployees = (companyEmail) => axios.get(`${API}/weeklyReportConfig/get/employees/`+companyEmail);
}
export default new WeeklyReportConfigService();