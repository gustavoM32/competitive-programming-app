import { screen } from "@testing-library/react";
import Problems from "./Problems";
import * as crudHooks from "hooks/crudHooks";
import { renderWithClient } from "testUtils";

describe("when it is loading", () => {
  it("shows loading text", async () => {
    const useReadPage = () => ({
      isLoading: true,
      resources: [],
      page: { totalPages: 1 },
    });

    // @ts-ignore
    jest.spyOn(crudHooks, "useReadPage").mockImplementation(useReadPage);

    renderWithClient(<Problems />);

    expect(screen.getByText(/Loading/i)).toBeInstanceOf(Node);
  });
});

describe("when error on fetching", () => {
  it("prints to error console", async () => {
    const useReadPage = () => ({
      isError: true,
      resources: [],
      page: { totalPages: 1 },
    });

    // @ts-ignore
    jest.spyOn(crudHooks, "useReadPage").mockImplementation(useReadPage);

    console.error = jest.fn();

    renderWithClient(<Problems />);

    expect(console.error).toHaveBeenCalled();
  });
});

describe("when fetching is successful", () => {
  it("shows problem name in table", async () => {
    const problemName = "problem ABCD";
    const useReadPage = () => ({
      isLoading: false,
      resources: [
        {
          name: problemName,
          _links: { self: { href: "id" } },
        },
      ],
      page: { totalPages: 1 },
    });

    // @ts-ignore
    jest.spyOn(crudHooks, "useReadPage").mockImplementation(useReadPage);

    renderWithClient(<Problems />);

    expect(screen.getByText(problemName)).toBeInstanceOf(Node);
  });
});
