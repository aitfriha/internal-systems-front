import axios from 'axios';
import { API } from '../../config/apiUrl';

class WeeklyReportService {
getExtendedWeeklyReport = (data) => axios.post(`${API}/weeklyReport/getExtended`,data);
}
export default new WeeklyReportService();