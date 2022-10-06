import axios from 'axios';
import { API } from '../../config/apiUrl';

class ContractService {
    getContract = () => axios.get(`${API}/contract/all`);

    getContractById = Id => axios.post(`${API}/contract/row/${Id}`);

    saveContract = contract => axios.post(`${API}/contract/add`, contract, {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    });

    updateContract = contract => axios.post(`${API}/contract/update`, contract);

    deleteContract = Id => axios.post(`${API}/contract/delete/${Id}`);

    checkContractStatus = IdContractStatus => axios.post(`${API}/contract/checkContractStatus/${IdContractStatus}`);
}
export default new ContractService();
