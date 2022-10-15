import { screen } from "@testing-library/react";
import ProblemList from "./ProblemList";
import * as crudHooks from "hooks/crudHooks";
import { useParams } from "react-router-dom";
import { renderWithClient } from "testUtils";

const reactRouterDom = { useParams };
jest
  .spyOn(reactRouterDom, "useParams")
  .mockReturnValue({ problemListId: "id" });

describe("when it is loading", () => {
  it("shows loading text", async () => {
    const useReadList = () => ({
      isLoading: true,
      resources: [],
    });

    const useRead = () => ({
      isLoading: true,
      resource: {},
    });

    // @ts-ignore
    jest.spyOn(crudHooks, "useReadList").mockImplementation(useReadList);
    // @ts-ignore
    jest.spyOn(crudHooks, "useRead").mockImplementation(useRead);

    renderWithClient(<ProblemList />);

    expect(screen.getByText(/Loading/i)).toBeInstanceOf(Node);
  });
});

describe("when error on fetching", () => {
  it("prints to error console", async () => {
    const useReadList = () => ({
      isError: true,
      resources: [],
    });

    const useRead = () => ({
      isError: true,
      resource: {},
    });

    // @ts-ignore
    jest.spyOn(crudHooks, "useReadList").mockImplementation(useReadList);
    // @ts-ignore
    jest.spyOn(crudHooks, "useRead").mockImplementation(useRead);

    console.error = jest.fn();

    renderWithClient(<ProblemList />);

    expect(console.error).toHaveBeenCalled();
  });
});
