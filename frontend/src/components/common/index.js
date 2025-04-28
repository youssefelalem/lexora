// تصدير جميع المكونات المشتركة من ملف واحد
// هذا يسهل استيراد المكونات في باقي أجزاء التطبيق

import ErrorModal from './ErrorModal/ErrorModal';
import NotificationToast from './NotificationToast/NotificationToast';
import StatusBadge from './StatusBadge/StatusBadge';
import RoleBadge from './RoleBadge/RoleBadge';
import UserAvatar from './UserAvatar/UserAvatar';
import Pagination from './Pagination/Pagination';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import EmptyState, { EmptySearchResults, EmptyList, CreateFirstItem } from './EmptyState/EmptyState';
import ConfirmDialog from './ConfirmDialog/ConfirmDialog';
import DataTable from './DataTable/DataTable';

// تصدير المكونات لاستخدامها في المشروع
export {
  ErrorModal,
  NotificationToast,
  StatusBadge,
  RoleBadge,
  UserAvatar,
  Pagination,
  LoadingSpinner,
  EmptyState,
  EmptySearchResults,
  EmptyList,
  CreateFirstItem,
  ConfirmDialog,
  DataTable,
};

/**
 * مثال على طريقة استيراد المكونات:
 * 
 * import { ErrorModal, NotificationToast, StatusBadge } from '../components/common';
 * 
 * أو استيراد جميع المكونات:
 * 
 * import * as CommonComponents from '../components/common';
 * // ثم استخدامها:
 * <CommonComponents.StatusBadge status="active" />
 */