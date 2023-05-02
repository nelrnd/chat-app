import { ReactComponent as AlertSVG } from '../../assets/icons/alert.svg';
import { ReactComponent as BackSVG } from '../../assets/icons/back.svg';
import { ReactComponent as CheckSVG } from '../../assets/icons/check.svg';
import { ReactComponent as CloseSVG } from '../../assets/icons/close.svg';
import { ReactComponent as EditSVG } from '../../assets/icons/edit.svg';
import { ReactComponent as ImageSVG } from '../../assets/icons/image.svg';
import { ReactComponent as InfoSVG } from '../../assets/icons/info.svg';
import { ReactComponent as NewSVG } from '../../assets/icons/new.svg';
import { ReactComponent as SearchSVG } from '../../assets/icons/search.svg';
import { ReactComponent as SendSVG } from '../../assets/icons/send.svg';
import { ReactComponent as SettingsSVG } from '../../assets/icons/settings.svg';

import './Icon.css';

const Icon = ({ name, size = 'medium' }) => {
  let icon;
  if (name === 'alert') icon = <AlertSVG />;
  if (name === 'back') icon = <BackSVG />;
  if (name === 'check') icon = <CheckSVG />;
  if (name === 'close') icon = <CloseSVG />;
  if (name === 'edit') icon = <EditSVG />;
  if (name === 'image') icon = <ImageSVG />;
  if (name === 'info') icon = <InfoSVG />;
  if (name === 'new') icon = <NewSVG />;
  if (name === 'search') icon = <SearchSVG />;
  if (name === 'send') icon = <SendSVG />;
  if (name === 'settings') icon = <SettingsSVG />;

  return <div className={`Icon ${size}`}>{icon}</div>;
};

export default Icon;
