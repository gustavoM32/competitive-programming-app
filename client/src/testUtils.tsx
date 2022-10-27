import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";
import { render } from "@testing-library/react";

export function renderWithClient(ui: React.ReactElement) {
  render(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
  );
}
