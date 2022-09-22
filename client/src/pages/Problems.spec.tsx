import { screen } from '@testing-library/react'
import Problems from './Problems'
import * as crudHooks from 'hooks/crudHooks';
import { renderWithClient } from 'testUtils';

describe('when it is loading', () => {
  it('shows loading text', async () => {
    const useReadList = () => ({
      isLoading: true,
      resources: []
    });

    // @ts-ignore
    jest.spyOn(crudHooks, 'useReadList').mockImplementation(useReadList);
  
    renderWithClient(
      <Problems/>
    )
  
    expect(screen.getByText(/Loading/i)).toBeInstanceOf(Node);
  })
})

describe('when error on fetching', () => {
  it('prints to error console', async () => {
    const useReadList = () => ({
      isError: true,
      resources: []
    });
    
    // @ts-ignore
    jest.spyOn(crudHooks, 'useReadList').mockImplementation(useReadList);
    
    console.error = jest.fn();

    renderWithClient(
      <Problems/>
    )
  
    expect(console.error).toHaveBeenCalled();
  })
})

describe('when fetching is successful', () => {
  it('shows problem name in table', async () => {
    const problemName = "problem ABCD";
    const useReadList = () => ({
      isLoading: false,
      resources: [{ 
        name: problemName,
        _links: { self: { href: "id"} }
      }]
    });
    
    // @ts-ignore
    jest.spyOn(crudHooks, 'useReadList').mockImplementation(useReadList);
    
    renderWithClient(
      <Problems/>
    )

    expect(screen.getByText(problemName)).toBeInstanceOf(Node);
  })
})

