import React, { ErrorInfo, ReactNode } from "react";

type Props = {
  children?: ReactNode;
}

type State = {
  hasError: boolean;
  error: string;
  errorInfo: any;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: '',
    errorInfo: null
  };

  constructor(props: any) {
    super(props);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Display fallback UI
    this.setState({ hasError: true, error: error.toString(), errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <h1>{this.state.error}</h1>;
    }

    return this.props.children;
  }
}
