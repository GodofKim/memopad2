import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  login: {
    status: 'INIT'
  },
  register: {
    status: 'INIT',
    error: -1
  },
  status: {
    valid: false,
    isLoggedIn: false,
    currentUser: ''
  }
};

export default function authentication(state, action) {
  if(typeof state === "undefined"){
    state = initialState;
  }

  switch(action.type){
    /*LOGIN*/
    case types.AUTH_LOGIN:
      return update(state, {//update => 객체 변형하는 모듈
        login: {
          status: { $set: 'WATING'}
        }
      });
    case types.AUTH_LOGIN_SUCCESS:
      return update(state, {
        login: {
          status: { $set: 'SUCCESS'}
        },
        status: {
          isLoggedIn: { $set: true },
          currentUser: { $set: action.username }
        }
      });
    case types.AUTH_LOGIN_FAILURE:
      return update(state, {
        login: {
          status: { $set: 'FAILURE' }
        }
      });
    case types.AUTH_REGISTER:
      return update(state, {
        register: {
          status: { $set: 'WATING'},
          error: { $set: -1 }
        }
      });
    case types.AUTH_REGISTER_SUCCESS:
      return update(state, {
        register: {
          status: { $set: 'SUCCESS'}
        }
      });
    case types.AUTH_REGISTER_FAILURE:
      return update(state, {
        register: {
          status: { $set: 'FAILURE'},
          error: { $set: action.error }
        }
      });
    case types.AUTH_GET_STATUS:
      return update(state, {
        status: {
          isLoggedIn: { $set: true }
          //페이지 새로고침 했을때 잠깐이지만 로그인 안 되어있는 상태를 방지한다. 세션 확인해서 유효하지않으면 로그인 해제하도록 밑에서 설정됨.
        }
      });
    case types.AUTH_GET_STATUS_SUCCESS:
      return update(state, {
        status: {
          valid: { $set: true },
          currentUser: { $set: action.username }
        }
      });
    case types.AUTH_GET_STATUS_FAILURE:
      return update(state, {
        valid: { $set: false },
        isLoggedIn: { $set: false }
      });
    /* LOGOUT */
    case types.AUTH_LOGOUT:
      return update(state, {
        status: {
          isLoggedIn: { $set: false },
          currentUser: { $set: '' }
        }
      });

    default:
      return state;
  }
}
