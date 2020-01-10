import React, { Component } from "react";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import "moment/locale/fi";
import "react-datepicker/dist/react-datepicker.css";

moment.locale("fi");

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      selectedDate: date
    });
    this.props.handleChange(moment(date).format("DD.MM.YYYY"));
  }

  render() {
    const { customInput } = this.props;
    return (
      <ReactDatePicker
        customInput={
          <CustomInput
            input={customInput}
            type="text"
            value={this.state.selectedDate}
          />
        }
        selected={this.state.selectedDate}
        onChange={this.handleChange}
      />
    );
  }
}

class CustomInput extends Component {
  render() {
    const { input, type, value, onClick } = this.props;
    return <input {...input} type={type} value={value} onClick={onClick} />;
  }
}

export default DatePicker;
