import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';

import { WafCreate } from './WafCreate';

describe('WAF Create', () => {
  it('renders the create WAF page with header', () => {
    renderWithTheme(<WafCreate />);

    expect(screen.getByText('Create WAF')).toBeVisible();
  });

  it('renders all form sections', () => {
    renderWithTheme(<WafCreate />);

    expect(screen.getByText('Name your WAF')).toBeVisible();
    expect(screen.getByText('Assign NodeBalancers')).toBeVisible();
    expect(screen.getByText('Summary')).toBeVisible();
  });

  it('renders create button', () => {
    renderWithTheme(<WafCreate />);

    const createButton = screen.getByRole('button', { name: 'Create WAF' });
    expect(createButton).toBeVisible();
    expect(createButton).toHaveAttribute('type', 'submit');
  });

  it('updates summary when WAF name is entered', async () => {
    renderWithTheme(<WafCreate />);

    const nameInput = screen.getByLabelText('WAF Label');
    await userEvent.type(nameInput, 'Test WAF');

    await waitFor(() => {
      expect(screen.getByText('Test WAF')).toBeVisible();
    });
  });
});
