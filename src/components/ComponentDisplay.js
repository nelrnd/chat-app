import Button from './Button/Button';

import { ReactComponent as SendIcon } from '../assets/icons/image.svg';
const ComponentsDisplay = () => {
  return (
    <div>
      <Button disabled={true}>Button</Button>
      <Button size="large">Button</Button>
      <Button size="small">
        <SendIcon />
        Cancel
      </Button>

      <Button type="secondary">
        <SendIcon />
        Upload
      </Button>
    </div>
  );
};

export default ComponentsDisplay;
