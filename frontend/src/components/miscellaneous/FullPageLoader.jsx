import React, { Component } from "react";
import { Oval } from "react-loader-spinner";
import { connect } from "react-redux";

class FullPageLoader extends Component {
  render() {
    const { loaderData } = this.props;

    if (loaderData && loaderData.isVisible) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "sticky",
            zIndex: 9999999,
            opacity: 0.95,
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              width: 200,
              height: 150,
              textAlign: "center",
            }}
          >
            <Oval color={"#3498DB"} />
            {loaderData && loaderData.loaderText ? (
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 17,
                  marginTop: 10,
                  color: "#3498DB",
                  fontWeight: 600,
                }}
              >
                {typeof loaderData?.loaderText === "string"
                  ? loaderData.loaderText
                  : "Loading..."}
              </p>
            ) : (
              <React.Fragment />
            )}
          </div>
        </div>
      );
    } else {
      return <React.Fragment />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    loaderData: state.loaderData,
  };
};

export default connect(mapStateToProps, null)(FullPageLoader);
