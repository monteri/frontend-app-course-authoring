import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import initializeStore from '../../store';
import UnitCard from './UnitCard';

// eslint-disable-next-line no-unused-vars
let axiosMock;
let store;

const section = {
  id: '1',
  displayName: 'Section Name',
  published: true,
  releasedToStudents: true,
  visibleToStaffOnly: false,
  visibilityState: 'visible',
  staffOnlyMessage: false,
  hasChanges: false,
  highlights: ['highlight 1', 'highlight 2'],
};

const subsection = {
  id: '12',
  displayName: 'Subsection Name',
  published: true,
  releasedToStudents: true,
  visibleToStaffOnly: false,
  visibilityState: 'visible',
  staffOnlyMessage: false,
  hasChanges: false,
};

const unit = {
  id: '123',
  displayName: 'unit Name',
  published: true,
  releasedToStudents: true,
  visibleToStaffOnly: false,
  visibilityState: 'visible',
  staffOnlyMessage: false,
  hasChanges: false,
};

const renderComponent = (props) => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <UnitCard
        section={section}
        subsection={subsection}
        unit={unit}
        onOpenPublishModal={jest.fn()}
        onOpenDeleteModal={jest.fn()}
        savingStatus=""
        onEditSubmit={jest.fn()}
        onDuplicateSubmit={jest.fn()}
        getTitleLink={(id) => `/some/${id}`}
        {...props}
      />
    </IntlProvider>,
  </AppProvider>,
);

describe('<UnitCard />', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    store = initializeStore();
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  });

  it('render UnitCard component correctly', async () => {
    const { findByTestId } = renderComponent();

    expect(await findByTestId('unit-card-header')).toBeInTheDocument();
    expect(await findByTestId('unit-card-header__title-link')).toHaveAttribute('href', '/some/123');
  });
});
