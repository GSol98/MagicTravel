import React from "react";

const checkOut = props => {
    return (
        <div className="input-group">
            <div className="input-group-prepend col-4 col-sm-4 col-md-5 m-0 p-0">
                <span className="input-group-text" style={{ width: "100%", height: "38px" }}>Check-Out</span>
            </div>

            <input
                className="form-control"
                type="date"
                name="CheckOut"
                value={props.state.CheckOut}
                onChange={props.handleChange}
                required
            />
        </div>
    )
}
export default checkOut;