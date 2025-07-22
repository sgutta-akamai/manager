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

    // Check for the WAF-specific title
    expect(getByText(/akamai cloud waf/i)).toBeInTheDocument();
    // Check for the description text
    expect(getByText(/safeguard your web applications/i)).toBeInTheDocument();
  });
});
