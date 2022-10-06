import {
  ADD_ABSENCEREQUEST,
  DELETE_ABSENCEREQUEST,
  GET_ALL_ABSENCEREQUESTS,
  GET_ALL_ABSENCEREQUEST_BY_ABSENCETYPE,
  UPDATE_ABSENCEREQUEST,
  UPDATE_ABSENCECONSULT
} from './constants';

export const saveAbsenceRequest = absenceRequest => ({
  type: ADD_ABSENCEREQUEST,
  absenceRequest
});

export const updateAbsenceRequest = absenceRequest => ({
  type: UPDATE_ABSENCEREQUEST,
  absenceRequest
});

export const updateAbsenceConsult = absenceRequestWithId => ({
  type: UPDATE_ABSENCECONSULT,
  absenceRequestWithId
});

export const deleteAbsenceRequest = absenceRequestId => ({
  type: DELETE_ABSENCEREQUEST,
  absenceRequestId
});

export const getAllAbsenceRequest = () => ({
  type: GET_ALL_ABSENCEREQUESTS
});

export const getAllAbsenceRequestByAbsenceType = absenceTypeId => ({
  type: GET_ALL_ABSENCEREQUEST_BY_ABSENCETYPE,
  absenceTypeId
});
