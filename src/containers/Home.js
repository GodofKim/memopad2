import React from 'react';
import { connect } from 'react-redux';
import { Write, MemoList } from 'components';
import { memoPostRequest, memoListRequest } from 'actions/memo';

class Home extends React.Component {



  constructor(props){
    super(props);

    this.handlePost = this.handlePost.bind(this);

    this.loadNewMemo = this.loadNewMemo.bind(this);
    this.loadOldMemo = this.loadOldMemo.bind(this);

    this.state = {
      loadingState: false
    };
  }

  componentDidMount() {
    // LOAD NEW MEMO EVERY 5 SECONDS
    const loadMemoLoop = () => {
      this.loadNewMemo().then(
        () => {
          this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
          // this 객체에 이 프로퍼티가 없으면 자동으로 만듦. JS 특성.
        }
      );
    };

    const loadUntilScrollable = () => {
      // iF THE SCROLLBAR DOES NOT EXIST,
      if($("body").height() < $(window).height()){
        this.loadOldMemo().then(
          () => {
            // DO THIS RECURSIVELY UNLESS IT'S THE LAST PAGE
            if(!this.props.isLast){
              loadUntilScrollable();
            }
          }
        );
      }
    };

    this.props.memoListRequest(true).then(
      () => {
        // BEGIN NEW MEMO LOADING LOOP
        loadUntilScrollable();
        loadMemoLoop();
      }
    );

    $(window).scroll(() => {
      // WHEN HEIGHT UNDER SCROLLBOTTOM IS LESS THEN 250
      if ($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
        if(!this.state.loadingState){
          this.loadOldMemo();
          this.setState({
            loadingState: true
          });
        }
      }
      else {
        if(this.state.loadingState){
          this.setState({
            loadingState: false
          });
        }
      }
    });
  }

  componentWillUnmount() {
    // STOPS THE loadMemoLoop
    clearTimeout(this.memoLoaderTimeoutId);

    // REMOVE WINDOWS SCROLL LISTENER
    $(window).unbind();
  }

  loadNewMemo() {
    // CANCEL IF THERE IS A PENDING REQUEST
    if(this.props.listStatus === 'WAITING')
      return new Promise((resolve, reject) => {
        resolve();
      }); // 무슨 뜻이야 이건. 빈 프라미스 => 함수를 끝내는 return이랑 같은 의미인데
    //대신 호출자가 .then을 사용하기 위해 프라미스를 리턴한다.

    // IF PAGE IS EMPTY, DO THE INITIAL LOADING
    if(this.props.memoData.length === 0){
      return this.props.memoListRequest(true);
    }

    return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id);
  }

  loadOldMemo() {
    // CANCEL IF USER IS READING THE LAST PAGE
    if(this.props.isLast){
      return new Promise(
        (resolve, reject) => {
          resolve();
        }
      );
    }

    // GET ID OF THE MEMO AT THE BOTTM
    let lastId = this.props.memoData[this.props.memoData.length-1]._id;

    // START REQUEST
    return this.props.memoListRequest(false, 'old', lastId).then(() => {
      // IF IT IS LAST PAGE, NOTIFY
      if(this.props.isLast){
        Materialize.toast('You are reading the last page', 2000);
      }
    });
  }

  /* POST MEMO */
  handlePost(contents) {
    return this.props.memoPostRequest(contents).then(
      () => {
        if(this.props.postStatus.status === "SUCCESS") {
          //TRIGGER LOAD NEW MEMO
          this.loadNewMemo().then(
            () => {
              Materialize.toast('Success!', 2000);
            }
          );

        } else {
          /*
            ERROR CODES
              1: NOT LOGGED IN
              2: EMPTY CONTENTS
          */
          let $toastContent;
          switch(this.props.postStatus.error) {
            case 1:
              // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
              $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>');
              Materialize.toast($toastContent, 2000);
              //로그인 상태가 아니라면 알림을 띄우고 2초 뒤 새로고침.
              setTimeout(() => {location.reload(false);}, 2000);
              break;
            case 2:
              $toastContent = $('<span style="color: #FFB4BA">Please write something</span>');
              Materialize.toast($toastContent, 2000);
              break;
            default:
              $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
              Materialize.toast($toastContent,2000);
              break;
          }
        }
      }
    );
  }

  render() {
    const write = ( <Write onPost={this.handlePost}/> );

    return (
      <div className="wrapper">
        { this.props.isLoggedIn ? write : undefined }
        <MemoList data={this.props.memoData} currentUser={this.props.currentUser}/>
      </div>
    );
  }
}

const mapStateToProps = (state) =>{
  return {
    isLoggedIn: state.authentication.status.isLoggedIn,
    postStatus: state.memo.post,
    currentUser: state.authentication.status.currentUser,
    memoData: state.memo.list.data,
    listStatus: state.memo.list.status,
    isLast: state.memo.list.isLast
  };
};

const mapDispatchToProps = (dispatch)  => {
  return {
    memoPostRequest: (contents) => {
      return dispatch(memoPostRequest(contents));
    },
    memoListRequest: (isInitial, listType, id, username) => {
      return dispatch(memoListRequest(isInitial, listType, id, username));
    }
  };
};

export default connect (mapStateToProps, mapDispatchToProps)(Home);
