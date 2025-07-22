import React from 'react';

import { WafEmptyState } from 'src/features/Waf/WafLanding/WafEmptyState';
import { renderWithTheme } from 'src/utilities/testHelpers';

const queryMocks = vi.hoisted(() => ({
  useParams: vi.fn().mockReturnValue({}),
  useWafsQuery: vi.fn().mockReturnValue({}),
}));

describe('WafLandingEmptyState', () => {
  it('should render Waf landing with empty state', async () => {
    queryMocks.useWafsQuery.mockReturnValue({
      data: {
        waf_configs: [],
        results: 0,
      },
    });

    const { getByText } = renderWithTheme(<WafEmptyState />, {
      initialRoute: '/waf',
    });

    expect(getByText(/safeguard your web applications/i)).toBeInTheDocument();
  });
});
