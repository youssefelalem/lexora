# Common Components Library

This folder contains reusable UI components used throughout the Lexora application. These components are designed to maintain consistency in the user interface and simplify development.

## Available Components

1. **ErrorModal**
   - Purpose: Displays error messages in a modal dialog
   - Location: ./ErrorModal/ErrorModal.js

2. **NotificationToast**
   - Purpose: Shows temporary notifications to the user
   - Location: ./NotificationToast/NotificationToast.js

3. **StatusBadge**
   - Purpose: Displays status indicators with appropriate styling
   - Location: ./StatusBadge/StatusBadge.js

4. **RoleBadge**
   - Purpose: Displays user roles with appropriate styling
   - Location: ./RoleBadge/RoleBadge.js

5. **UserAvatar**
   - Purpose: Displays user profile images or initials
   - Location: ./UserAvatar/UserAvatar.js

6. **Pagination**
   - Purpose: Handles page navigation for lists and tables
   - Location: ./Pagination/Pagination.js

7. **LoadingSpinner**
   - Purpose: Shows loading indicators during async operations
   - Location: ./LoadingSpinner/LoadingSpinner.js

8. **EmptyState**
   - Purpose: Displays appropriate UI when no data is available
   - Variations:
     - EmptySearchResults: Shown when search returns no results
     - EmptyList: Shown when a list/table is empty
     - CreateFirstItem: Encourages creating the first item
   - Location: ./EmptyState/EmptyState.js

9. **ConfirmDialog**
   - Purpose: Asks for user confirmation before critical actions
   - Location: ./ConfirmDialog/ConfirmDialog.js

10. **DataTable**
    - Purpose: Displays data in a structured table format
    - Location: ./DataTable/DataTable.js

## How to Use

You can import these components in two ways:

1. **Import specific components:**
```javascript
import { ErrorModal, NotificationToast, StatusBadge } from '../components/common';
```

2. **Import all components:**
```javascript
import * as CommonComponents from '../components/common';
// Then use them:
<CommonComponents.StatusBadge status="active" />
```

## Component Structure

Each component is organized in its own folder with related files (styles, tests, etc.). This structure helps maintain separation of concerns and makes the codebase more maintainable.

