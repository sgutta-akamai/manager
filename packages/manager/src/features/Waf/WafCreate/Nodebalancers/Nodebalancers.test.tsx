import React from 'react';

import { Nodebalancers } from 'src/features/Waf/WafCreate/Nodebalancers/Nodebalancers';
import { renderWithThemeAndHookFormContext } from 'src/utilities/testHelpers';

describe('WAF Create Nodebalancers', () => {
  it('renders a header', () => {
    const { getByText } = renderWithThemeAndHookFormContext({
      component: <Nodebalancers />,
    });

    const header = getByText('Assign NodeBalancers');

    expect(header).toBeVisible();
    expect(header.tagName).toBe('H2');
  });

  it('renders a description text', () => {
    const { getByText } = renderWithThemeAndHookFormContext({
      component: <Nodebalancers />,
    });

    const description = getByText(
      'Select an existing NodeBalancer to associate with this WAF configuration.'
    );

    expect(description).toBeVisible();
  });

  it('renders a NodeBalancers selection field', () => {
    const { getByLabelText } = renderWithThemeAndHookFormContext({
      component: <Nodebalancers />,
    });

    expect(getByLabelText('NodeBalancers')).toBeVisible();
  });
});
