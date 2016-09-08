import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  post: {
    status: 'INIT',
    error: -1
  },
  list: {
    status: 'INIT',
    data: [],
    isLast: false
  }
};

export default function memo(state, action) {
  if(typeof state === "undefined"){
    state = initialState;
  }

  switch(action.type) {
    case types.MEMO_POST:
      return update(state, {
        post: {
          status: { $set: 'WAITING' },
          error: { $set: -1 }
        }
      });
    case types.MEMO_POST_SUCCESS:
      return update(state, {
        post: {
        status: { $set: 'SUCCESS' }
        }
      });
    case types.MEMO_POST_FAILURE:
      return update(state, {
        post: {
        status: { $set: 'FAILURE' },
        error: { $set: action.error }
        }
      });
    case types.MEMO_LIST:
      return update(state, {
        list: {
          status: { $set: 'WAITING'}
        }
      });
    case types.MEMO_LIST_SUCCESS:
      if(action.isInitial){
        return update(state, {
          list: {
            status: { $set: 'SUCCESS'},
            data: { $set: action.data },
            isLast: { $set: action.data.length < 6 }
          }
        });
      } else {
        if(action.listType === 'new') {
          return update(state, {
            list: {
              status: { $set: 'SUCCESS'},
              data: { $unshift: action.data }
              // 배열의 앞부분에 데이터를 추가할 땐 $unshift, 뒷부분에 추가할땐 $push
            }
          });
        } else {
          return update(state, {
            list: {
              status: { $set: 'SUCCESS'},
              data: { $push: action.data },
              isLast: { $set: action.data.length < 6 }
            }
          });
        }
      }

      return state;
    case types.MEMO_LIST_FAILURE:
      return update(state, {
        list: {
          status: { $set: 'FAILURE'}
        }
      });
    default:
      return state;
  }
}
