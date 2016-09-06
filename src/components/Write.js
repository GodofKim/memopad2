import React from 'react';

class Write extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      contents: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      contents: e.target.value
    });
  }

  render() {
    return (
      <div className="container write">
        <div className="card">
          <div className="card-content">
            <textarea className="materialize-textarea" placeholder="Write down your memo" value={this.state.contents} onChange={this.handleChange}></textarea>
            <div className="card-action">
              <a>POST</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Write.propTypes = {
  onPost: React.PropTypes.func
};

Write.defaultProps = {
  onPost: (content) => { console.log('post function not defined'); }
};

export default Write;
