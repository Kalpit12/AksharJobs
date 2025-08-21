import React from "react";
import "../styles/InputField.css";

const InputField = ({ label, type, name, value, onChange, required }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} />
    </div>
  );
};

export default InputField;
