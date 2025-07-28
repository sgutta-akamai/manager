import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { WafCreate } from 'src/features/Waf/WafCreate/WafCreate';
import {
  renderWithTheme,
  renderWithThemeAndHookFormContext,
} from 'src/utilities/testHelpers';

import { Summary } from './Summary';

describe('WAF Create Summary', () => {
  it('renders the summary section with header', () => {
    const { getByText } = renderWithThemeAndHookFormContext({
      component: <Summary />,
    });

    expect(getByText('Summary')).toBeVisible();
  });

  it('updates summary when WAF name is entered', async () => {
    renderWithTheme(<WafCreate />);

    const nameInput = screen.getByLabelText('WAF Label');
    await userEvent.type(nameInput, 'Test WAF');

    await waitFor(() => {
      expect(screen.getByText('Test WAF')).toBeVisible();
    });
  });

  it('does not display zero state with "Linode" text', () => {
    const { queryByText } = renderWithThemeAndHookFormContext({
      component: <Summary />,
    });

    expect(queryByText('Linode')).not.toBeInTheDocument();
  });

  //TODO - add remaining tests for the new component structure with form context
});
