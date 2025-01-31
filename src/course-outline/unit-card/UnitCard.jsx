import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useToggle } from '@edx/paragon';

import { setCurrentItem, setCurrentSection, setCurrentSubsection } from '../data/slice';
import { RequestStatus } from '../../data/constants';
import CardHeader from '../card-header/CardHeader';
import BaseTitleWithStatusBadge from '../card-header/BaseTitleWithStatusBadge';
import TitleLink from '../card-header/TitleLink';
import { getItemStatus, scrollToElement } from '../utils';

const UnitCard = ({
  unit,
  subsection,
  section,
  onOpenPublishModal,
  onEditSubmit,
  savingStatus,
  onOpenDeleteModal,
  onDuplicateSubmit,
  getTitleLink,
}) => {
  const currentRef = useRef(null);
  const dispatch = useDispatch();
  const [isFormOpen, openForm, closeForm] = useToggle(false);
  const namePrefix = 'unit';

  const {
    id,
    displayName,
    hasChanges,
    published,
    releasedToStudents,
    visibleToStaffOnly = false,
    visibilityState,
    staffOnlyMessage,
  } = unit;

  const unitStatus = getItemStatus({
    published,
    releasedToStudents,
    visibleToStaffOnly,
    visibilityState,
    staffOnlyMessage,
  });

  const handleClickMenuButton = () => {
    dispatch(setCurrentItem(unit));
    dispatch(setCurrentSection(section));
    dispatch(setCurrentSubsection(subsection));
  };

  const handleEditSubmit = (titleValue) => {
    if (displayName !== titleValue) {
      onEditSubmit(id, section.id, titleValue);
      return;
    }

    closeForm();
  };

  const titleComponent = (
    <TitleLink
      titleLink={getTitleLink(id)}
      namePrefix={namePrefix}
    >
      <BaseTitleWithStatusBadge
        title={displayName}
        status={unitStatus}
        namePrefix={namePrefix}
      />
    </TitleLink>
  );

  useEffect(() => {
    // if this items has been newly added, scroll to it.
    // we need to check section.shouldScroll as whole section is fetched when a
    // unit is duplicated under it.
    if (currentRef.current && (section.shouldScroll || unit.shouldScroll)) {
      scrollToElement(currentRef.current);
    }
  }, []);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      closeForm();
    }
  }, [savingStatus]);

  return (
    <div className="unit-card" data-testid="unit-card" ref={currentRef}>
      <CardHeader
        title={displayName}
        status={unitStatus}
        hasChanges={hasChanges}
        onClickMenuButton={handleClickMenuButton}
        onClickPublish={onOpenPublishModal}
        onClickEdit={openForm}
        onClickDelete={onOpenDeleteModal}
        isFormOpen={isFormOpen}
        closeForm={closeForm}
        onEditSubmit={handleEditSubmit}
        isDisabledEditField={savingStatus === RequestStatus.IN_PROGRESS}
        onClickDuplicate={onDuplicateSubmit}
        titleComponent={titleComponent}
        namePrefix={namePrefix}
      />
    </div>
  );
};

UnitCard.propTypes = {
  unit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    releasedToStudents: PropTypes.bool.isRequired,
    visibleToStaffOnly: PropTypes.bool,
    visibilityState: PropTypes.string.isRequired,
    staffOnlyMessage: PropTypes.bool.isRequired,
    shouldScroll: PropTypes.bool,
  }).isRequired,
  subsection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    releasedToStudents: PropTypes.bool.isRequired,
    visibleToStaffOnly: PropTypes.bool,
    visibilityState: PropTypes.string.isRequired,
    staffOnlyMessage: PropTypes.bool.isRequired,
    shouldScroll: PropTypes.bool,
  }).isRequired,
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    releasedToStudents: PropTypes.bool.isRequired,
    visibleToStaffOnly: PropTypes.bool,
    visibilityState: PropTypes.string.isRequired,
    staffOnlyMessage: PropTypes.bool.isRequired,
    shouldScroll: PropTypes.bool,
  }).isRequired,
  onOpenPublishModal: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  savingStatus: PropTypes.string.isRequired,
  onOpenDeleteModal: PropTypes.func.isRequired,
  onDuplicateSubmit: PropTypes.func.isRequired,
  getTitleLink: PropTypes.func.isRequired,
};

export default UnitCard;
