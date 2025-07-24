import React from 'react';

import { renderWithThemeAndHookFormContext } from 'src/utilities/testHelpers';

import { Summary } from './Summary';

describe('WAF Create Summary', () => {
  it('renders the summary section with header', () => {
    const { getByText } = renderWithThemeAndHookFormContext({
      component: (
        <Summary
          isHostsSet={false}
          isNodebalancersSet={false}
          isWafLabelSet={false}
          wafLabel=""
        />
      ),
    });

    expect(getByText('Summary')).toBeVisible();
  });

  it('displays WAF label when set', () => {
    const { getByText } = renderWithThemeAndHookFormContext({
      component: (
        <Summary
          isHostsSet={false}
          isNodebalancersSet={false}
          isWafLabelSet={true}
          wafLabel="Test WAF"
        />
      ),
    });

    expect(getByText('WAF')).toBeVisible();
    expect(getByText('Test WAF')).toBeVisible();
  });

  it('displays NodeBalancers section when set', () => {
    const { getByText } = renderWithThemeAndHookFormContext({
      component: (
        <Summary
          isHostsSet={false}
          isNodebalancersSet={true}
          isWafLabelSet={false}
          wafLabel=""
        />
      ),
    });

    expect(getByText('NodeBalancers Assigned')).toBeVisible();
  });

  it('displays Protected Resources section when set', () => {
    const { getByText } = renderWithThemeAndHookFormContext({
      component: (
        <Summary
          isHostsSet={true}
          isNodebalancersSet={false}
          isWafLabelSet={false}
          wafLabel=""
        />
      ),
    });

    expect(getByText('Protected Resources Defined')).toBeVisible();
  });

  it('displays all sections when everything is set', () => {
    const { getByText } = renderWithThemeAndHookFormContext({
      component: (
        <Summary
          isHostsSet={true}
          isNodebalancersSet={true}
          isWafLabelSet={true}
          wafLabel=""
        />
      ),
    });

    expect(getByText('WAF')).toBeVisible();
    expect(getByText('My WAF')).toBeVisible();
    expect(getByText('NodeBalancers Assigned')).toBeVisible();
    expect(getByText('Protected Resources Defined')).toBeVisible();
  });
});
