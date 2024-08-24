import { MembersPage } from '../members.page';
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { viewAllMembersPageServer } from './members-page-test-utils';
import { renderWithProviders } from '@/test-utils';
import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from 'vitest';
import { http, HttpResponse } from 'msw';

describe('MembersPage', () => {});
test('renders without crashing', () => {
  renderWithProviders(<MembersPage />);
});
beforeAll(() => viewAllMembersPageServer.listen());
afterEach(() => viewAllMembersPageServer.resetHandlers());
afterAll(() => viewAllMembersPageServer.close());

async function setup() {
  const user = userEvent.setup();
  const utils = renderWithProviders(<MembersPage />);

  return {
    user,
    ...utils,
  };
}

describe('MembersPage', () => {
  test('renders the page title correctly', async () => {
    await setup();

    expect(await screen.findByText('All Members')).toBeInTheDocument();
  });

  test('shows loading animation when data is loading', async () => {
    await setup();

    expect(await screen.findByTestId('loading-animation')).toBeInTheDocument();
  });

  test('renders Data Grid with correct columns', async () => {
    await setup();
    const grid = await screen.findByRole('grid');

    const headers = within(grid).getAllByRole('columnheader');
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent('ID');
    expect(headers[1]).toHaveTextContent('First Name');
    expect(headers[2]).toHaveTextContent('Last Name');
    expect(headers[3]).toHaveTextContent('Email');
    expect(headers[4]).toHaveTextContent('Phone');
    expect(headers[5]).toHaveTextContent('Status');
    expect(headers[6]).toHaveTextContent('Actions');
  });

  test('renders member data correctly in Data Grid rows', async () => {
    await setup();
    const grid = await screen.findByRole('grid');

    const rows = within(grid).getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header row + at least one data row
    const firstDataRow = rows[1];
    expect(within(firstDataRow).getByText('John')).toBeInTheDocument();
    expect(within(firstDataRow).getByText('Doe')).toBeInTheDocument();
    expect(
      within(firstDataRow).getByText('john@example.com'),
    ).toBeInTheDocument();
    expect(within(firstDataRow).getByText('1234567890')).toBeInTheDocument();
    expect(within(firstDataRow).getByText('Active')).toBeInTheDocument();
  });

  test('opens edit dialog when edit button is clicked', async () => {
    const { user } = await setup();
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-animation'),
    );
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);
    expect(screen.getByText('Edit Member')).toBeInTheDocument();
  });

  test('updates member', async () => {
    const { user } = await setup();
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-animation'),
    );

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);
    const firstNameInput = screen.getByRole('textbox', { name: 'First Name' });
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jim');
    const updateButton = screen.getByRole('button', { name: 'Update' });
    await user.click(updateButton);
    await waitFor(() => {
      expect(screen.queryByText('Edit Member')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('John')).not.toBeInTheDocument();
    expect(screen.getByText('Jim')).toBeInTheDocument();
  });

  test('closes edit dialog when cancel button is clicked', async () => {
    const { user } = await setup();
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-animation'),
    );

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);
    await waitForElementToBeRemoved(() => screen.queryByText('Edit Member'));

    expect(screen.queryByText('Edit Member')).not.toBeInTheDocument();
  });

  test('deletes member when confirmation is accepted', async () => {
    const { user } = await setup();
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-animation'),
    );

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    const confirmSpy = vi
      .spyOn(window, 'confirm')
      .mockImplementation(() => true);
    await user.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText('John')).not.toBeInTheDocument();
    });

    // Verify that the member is no longer in the list after re-fetch
    const grid = screen.getByRole('grid');
    const rows = within(grid).getAllByRole('row');
    expect(rows.length).toBe(2); // Header row + 1 remaining data row

    confirmSpy.mockRestore();
  });

  test('does not delete member when confirmation is canceled', async () => {
    const { user } = await setup();
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-animation'),
    );

    const deleteButtons = screen.getAllByRole('button', {
      name: 'Delete',
    });
    const confirmSpy = vi
      .spyOn(window, 'confirm')
      .mockImplementation(() => false);
    await user.click(deleteButtons[0]);

    expect(screen.getByText('Jane')).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  test('shows error message when there is an error', async () => {
    viewAllMembersPageServer.use(
      http.get('*', () => {
        return HttpResponse.json(
          { message: 'Error fetching data' },
          { status: 500 },
        );
      }),
    );
    renderWithProviders(<MembersPage />);

    expect(await screen.findByText('An error occurred')).toBeInTheDocument();
  });
});
