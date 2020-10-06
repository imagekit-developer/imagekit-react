import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, error: error.toString(), errorInfo: info });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>{this.state.error}</h1>;
    }
    return this.props.children;
  }
}
