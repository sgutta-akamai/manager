import { capitalize } from '@linode/utilities';
import { fireEvent } from '@testing-library/react';
import * as React from 'react';

import { wafConfigurationsFactory } from 'src/factories/wafs';
import {
  ActionHandlers,
  WafActionMenu,
} from 'src/features/Waf/WafLanding/WafActionMenu';
import { WafLanding } from 'src/features/Waf/WafLanding/WafLanding';
import { WafRow } from 'src/features/Waf/WafLanding/WafRow';
import { formatDate } from 'src/utilities/formatDate';
import {
  mockMatchMedia,
  renderWithTheme,
  wrapWithTableBody,
} from 'src/utilities/testHelpers';

beforeAll(() => mockMatchMedia());

const queryMocks = vi.hoisted(() => ({
  useParams: vi.fn().mockReturnValue({}),
  useWafsQuery: vi.fn().mockReturnValue({}),
}));

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useParams: queryMocks.useParams,
  };
});

vi.mock('@linode/queries', async () => {
  const actual = await vi.importActual('@linode/queries');
  return {
    ...actual,
    useWafsQuery: queryMocks.useWafsQuery,
  };
});

const handlers: ActionHandlers = {
  handleAnalytics: vi.fn(),
  handleDelete: vi.fn(),
  handleLogs: vi.fn(),
  handleOverview: vi.fn(),
  handleSettings: vi.fn(),
  handleStatusChange: vi.fn(),
};

describe('Waf Landing', () => {
  it('should render the Waf landing table with items', async () => {
    const wafConfigurations = wafConfigurationsFactory.buildList(10);
    queryMocks.useWafsQuery.mockReturnValueOnce({
      data: {
        waf_configs: wafConfigurations,
        page: 1,
        pages: 1,
        results: 10,
      },
    });

    const { getByText } = renderWithTheme(<WafLanding />, {
      initialRoute: '/waf',
    });

    // Static text and table column headers
    expect(getByText('Configuration Name')).toBeVisible();
    expect(getByText('Status')).toBeVisible();
    expect(getByText('NodeBalancers')).toBeVisible();
    expect(getByText('Last Updated')).toBeVisible();
  });

  it('should render a Waf row', async () => {
    const waf = wafConfigurationsFactory.build();

    const { getByText } = renderWithTheme(
      wrapWithTableBody(<WafRow handlers={handlers} waf={waf} />)
    );

    // Check to see if the row rendered some data
    expect(getByText(waf.label)).toBeVisible();
    expect(getByText(capitalize(waf.status))).toBeVisible();
    expect(getByText(formatDate(waf.updated))).toBeVisible();
  });

  it('should open an action menu', async () => {
    const waf = wafConfigurationsFactory.build();
    queryMocks.useWafsQuery.mockReturnValueOnce({
      data: {
        waf_configs: [waf],
        page: 1,
        pages: 1,
        results: 1,
      },
    });

    const { getByText, getByLabelText } = renderWithTheme(
      <WafActionMenu handlers={handlers} waf={waf} />
    );

    const actionMenu = getByLabelText(`Action menu for WAF ${waf.label}`);

    await fireEvent.click(actionMenu);

    getByText('Overview');
    getByText('Analytics');
    getByText('Logs');
    getByText('Settings');
    getByText('Delete');
  });
});
