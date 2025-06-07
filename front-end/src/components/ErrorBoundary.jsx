import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <h2>Erreur : {this.state.error?.message}</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;