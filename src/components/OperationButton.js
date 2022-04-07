import React from "react";

export function OperationButton(props) {
  function handleClick(event) {
    props.onClick(event.target.value)
  }

  return <button className="OperationButton" key={props.value} value={props.value} onClick={handleClick}>{props.value}</button>
}