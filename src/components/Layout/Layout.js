import './Layout.css';

const Layout = ({ theme, children }) => {
  return <div className={`Layout ${theme}`}>{children}</div>;
};

export default Layout;
