import React from "react";

const checkIn = props => {
    return (
        <div className="input-group" id="check-in">
            <div className="input-group-prepend col-4 col-sm-4 col-md-5 m-0 p-0">
                <span className="input-group-text" style={{ width: "100%", height: "38px" }}>Check-In</span>
            </div>

            <input
                className="form-control"
                type="date"
                name="CheckIn"
                value={props.state.CheckIn}
                onChange={props.handleChange}
                required
            />
        </div>
    )
}
export default checkIn;
