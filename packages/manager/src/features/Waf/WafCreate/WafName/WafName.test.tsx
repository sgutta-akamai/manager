import { waitFor } from '@testing-library/react';
import React from 'react';

import { WafName } from 'src/features/Waf/WafCreate/WafName/WafName';
import { renderWithThemeAndHookFormContext } from 'src/utilities/testHelpers';

describe('WAF Create Name', () => {
  it('renders a header', () => {
    const { getByText } = renderWithThemeAndHookFormContext({
      component: <WafName />,
    });

    const header = getByText('Name your WAF');

    expect(header).toBeVisible();
    expect(header.tagName).toBe('H2');
  });

  it('renders a "WAF Label" text field', () => {
    const { getByLabelText } = renderWithThemeAndHookFormContext({
      component: <WafName />,
    });

    expect(getByLabelText('WAF Label')).toBeVisible();
  });

  it('renders a placeholder text in the input field', () => {
    const { getByPlaceholderText } = renderWithThemeAndHookFormContext({
      component: <WafName />,
    });

    expect(getByPlaceholderText('WAF Label')).toBeVisible();
  });

  it('checks input field is enabled', async () => {
    const { getByLabelText } = renderWithThemeAndHookFormContext({
      component: <WafName />,
    });

    const labelInput = getByLabelText('WAF Label');

    await waitFor(() => {
      expect(labelInput).toBeEnabled();
    });
  });
});
