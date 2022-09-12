import React, { ErrorInfo } from "react";

export default class ErrorBoundary extends React.Component<
  {},
  { hasError: boolean; error: string | null; errorInfo: ErrorInfo | null }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
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
