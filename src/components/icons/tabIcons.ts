import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import DashboardTabIcon from '../../../assets/icons/dashboardTab.svg';
import MediaLibraryTabIcon from '../../../assets/icons/mediaLibraryTab.svg';
import MoreTabIcon from '../../../assets/icons/moreTab.svg';
import WatchTabIcon from '../../../assets/icons/watchTab.svg';
import { TabRoutes } from '../../navigation/routes';

export const tabIcons: Record<string, FC<SvgProps>> = {
  [TabRoutes.Dashboard]: DashboardTabIcon,
  [TabRoutes.Watch]: WatchTabIcon,
  [TabRoutes.MediaLibrary]: MediaLibraryTabIcon,
  [TabRoutes.More]: MoreTabIcon,
};
