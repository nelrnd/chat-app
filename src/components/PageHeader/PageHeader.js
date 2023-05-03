import './PageHeader.css';

const PageHeader = ({ children, withBorder = true }) => {
  return (
    <header className={`PageHeader ${withBorder ? 'border' : ''}`}>
      {children}
    </header>
  );
};

export default PageHeader;
