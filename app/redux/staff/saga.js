import { all, put } from 'redux-saga/effects';
import axios from 'axios';
import { takeLatest } from '@redux-saga/core/effects';
import {
  ADD_STAFF,
  ADD_STAFF_FAILURE,
  ADD_STAFF_SUCCESS,
  DELETE_STAFF,
  DELETE_STAFF_FAILURE,
  DELETE_STAFF_SUCCESS,
  GET_ALL_STAFFS,
  GET_ALL_STAFFS_FAILURE,
  GET_ALL_STAFFS_SUCCESS,
  UPDATE_STAFF,
  UPDATE_STAFF_FAILURE,
  UPDATE_STAFF_SUCCESS,
  GET_ALL_ASSIGNED_FUNCTIONAL_LEVEL_STAFFS,
  GET_ALL_ASSIGNED_FUNCTIONAL_LEVEL_STAFFS_SUCCESS,
  GET_ALL_ASSIGNED_FUNCTIONAL_LEVEL_STAFFS_FAILURE,
  GET_STAFF_BY_COMPANY_EMAIL,
  GET_STAFF_BY_COMPANY_EMAIL_SUCCESS,
  GET_STAFF_BY_COMPANY_EMAIL_FAILURE,
  GET_PAGINATION_STAFFS,
  GET_PAGINATION_STAFFS_SUCCESS,
  GET_PAGINATION_STAFFS_FAILURE
} from './constants';

import ENDPOINTS from '../../api/endpoints';

function* saveStaff(action) {
  try {
    const { staff } = action;
    const request = yield axios({
      method: 'post',
      url: ENDPOINTS.STAFF + '/add',
      data: staff
      /* headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryQ0pBuvRC1EzDAQWT----' } */
    });

    yield put({
      type: ADD_STAFF_SUCCESS,
      payload: request.data.payload
    });
  } catch (errors) {
    yield put({
      type: ADD_STAFF_FAILURE,
      errors: errors.response.data.errors
    });
  }
}

function* updateStaff(action) {
  try {
    const { staffWithId } = action;

    const request = yield axios({
      method: 'put',
      url: ENDPOINTS.STAFF + '/update',
      data: staffWithId
    });

    yield put({
      type: UPDATE_STAFF_SUCCESS,
      payload: request.data.payload
    });
  } catch (errors) {
    yield put({
      type: UPDATE_STAFF_FAILURE,
      errors: errors.response.data.errors
    });
  }
}

function* deleteStaff(action) {
  try {
    const { staffId } = action;

    const request = yield axios({
      method: 'delete',
      url: ENDPOINTS.STAFF + '/delete/' + staffId
    });

    yield put({
      type: DELETE_STAFF_SUCCESS,
      payload: request.data.payload
    });
  } catch (errors) {
    yield put({
      type: DELETE_STAFF_FAILURE,
      errors: errors.response.data.errors
    });
  }
}

function* getAllStaff() {
  try {
    const request = yield axios({
      method: 'get',
      url: ENDPOINTS.STAFF + '/all'
    });
    yield put({
      type: GET_ALL_STAFFS_SUCCESS,
      payload: request.data.payload
    });
  } catch (errors) {
    yield put({
      type: GET_ALL_STAFFS_FAILURE,
      errors: errors.response.data.errors
    });
  }
}

function* getStaffsPagination(action) {
  const { page, rowsPerPage, columnsType, searchText } = action;
  try {
    const request = yield axios({
      method: 'get',
      url: ENDPOINTS.STAFF + '/all/' + page + '/' + rowsPerPage + '/' + columnsType + '/' + searchText
    });
    yield put({
      type: GET_PAGINATION_STAFFS_SUCCESS,
      payload: request.data.payload
    });
  } catch (errors) {
    yield put({
      type: GET_PAGINATION_STAFFS_FAILURE,
      errors: errors.response.data.errors
    });
  }
}

function* allStaffAssignedToFunctionalLevel() {
  try {
    const request = yield axios({
      method: 'get',
      url: ENDPOINTS.STAFF + '/allStaffAssignedToFunctionalLevel'
    });
    yield put({
      type: GET_ALL_ASSIGNED_FUNCTIONAL_LEVEL_STAFFS_SUCCESS,
      payload: request.data.payload
    });
  } catch (errors) {
    yield put({
      type: GET_ALL_ASSIGNED_FUNCTIONAL_LEVEL_STAFFS_FAILURE,
      errors: errors.response.data.errors
    });
  }
}

function* getStaffByCompanyEmail(action) {
  try {
    const { data } = action;

    const request = yield axios({
      method: 'get',
      url: ENDPOINTS.STAFF + '/staff-by-company-email/' + data
    });

    yield put({
      type: GET_STAFF_BY_COMPANY_EMAIL_SUCCESS,
      payload: request.data.payload
    });
  } catch (errors) {
    yield put({
      type: GET_STAFF_BY_COMPANY_EMAIL_FAILURE,
      errors: errors.response.data.errors
    });
  }
}

export default function* staffSaga() {
  yield all([
    takeLatest(ADD_STAFF, saveStaff),
    takeLatest(UPDATE_STAFF, updateStaff),
    takeLatest(DELETE_STAFF, deleteStaff),
    takeLatest(GET_ALL_ASSIGNED_FUNCTIONAL_LEVEL_STAFFS, allStaffAssignedToFunctionalLevel),
    takeLatest(GET_ALL_STAFFS, getAllStaff),
    takeLatest(GET_STAFF_BY_COMPANY_EMAIL, getStaffByCompanyEmail),
    takeLatest(GET_PAGINATION_STAFFS, getStaffsPagination)
  ]);
}
