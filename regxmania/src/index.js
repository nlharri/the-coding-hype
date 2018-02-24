import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class InputString extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 'Hello Regexp!'
    };
  }

  render() {
    return (
      <form>
        <label for="intputval">Input:</label>
        <input
          id="inputval"
          type="text"
          name="inputval"
          value={this.state.inputValue}
          onChange={evt => this.updateInputValue(evt, this.props.onChange)}/>
      </form>
    );
  }

  updateInputValue(evt, onChangeFunc) {
    this.setState({
      inputValue: evt.target.value
    });
    onChangeFunc(evt);
  }
}

class InputRegex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }

  render() {
    return (
      <form>
        <label for="intputregex">Regex:</label>
        <input
          id="inputregex"
          type="text"
          name="inputregex"
          value={this.state.inputValue}
          onChange={evt => this.updateInputValue(evt, this.props.onChange)}/>
      </form>
    );
  }

  updateInputValue(evt, onChangeFunc) {
    this.setState({
      inputValue: evt.target.value
    });
    onChangeFunc(evt);
  }
}

class OutputResult extends React.Component {
  render() {
    const highlightBoundaries = this.props.highlightBoundaries;
    //console.log(highlightBoundaries);
    return (
      <p>{highlightBoundaries ? highlightBoundaries.map((boundary, index) => (
        <span key={index} className={boundary.match ? "highlight" : "nohighlight"}>{this.props.result.substring(boundary.from, (boundary.to))}</span>
      )) : this.props.result}</p>
    );
  }
}

class RegXMania extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      valueToBeProcessed: 'Hello Regexp!'
    };
  }

  onInputValChangeHandler = evt => {
    this.setState({
      valueToBeProcessed: (evt.target.value) ? evt.target.value : '' });
  }

  onInputRegexChangeHandler = evt => {
    this.setState({
      value: (evt.target.value) ? evt.target.value : '' });
  }

  processRegex = regexValue => {
    let regExp;
    if (regexValue) {
      try {
        regExp = new RegExp(regexValue, 'gi');
      } catch(e) {
        return;
      }
      let result;
      let val = this.state.valueToBeProcessed;
      let lastIndexPrev = 0;
      var ret = [];
      while (result = regExp.exec(val)) {
        if (result['index'] == regExp.lastIndex) regExp.lastIndex++;
        if(result['index']>0) {
          ret = ret.concat(
            [{
              from: lastIndexPrev,
              to: result['index'],
              match: false
            }]
          );
      	}
        ret = ret.concat(
          [{
            from: result['index'],
            to: regExp.lastIndex,
            match: true
          }]
        );
      	lastIndexPrev = regExp.lastIndex;
      }
      if (lastIndexPrev<val.length) {
        ret = ret.concat(
          [{
            from: lastIndexPrev,
            to: val.length,
            match: false
          }]
        );
      }

      console.dir(ret);
      return ret;
    }
  }

  render() {
    return (
      <div>
        <div className="input">
          <InputString
            value={this.state.valueToBeProcessed}
            onChange={this.onInputValChangeHandler}/>
        </div>
        <div className="input">
          <InputRegex
            value={this.state.value}
            onChange={this.onInputRegexChangeHandler}/>
        </div>
        <div className="output">
          <OutputResult
            result={this.state.valueToBeProcessed}
            highlightBoundaries={this.processRegex(this.state.value)}
          />
        </div>
    </div>
    )
  }
}

ReactDOM.render(
  <RegXMania />,
  document.getElementById('root')
);
