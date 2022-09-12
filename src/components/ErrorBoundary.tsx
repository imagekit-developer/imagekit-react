import React, { ErrorInfo } from "react";

interface IProps {
  children: JSX.Element;
}

interface IState {
  hasError: boolean;
  error: string | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
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
