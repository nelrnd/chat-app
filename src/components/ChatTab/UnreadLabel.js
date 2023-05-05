const UnreadLabel = ({ count }) => {
  return <div className="UnreadLabel">{count < 10 ? count : '9+'}</div>;
};

export default UnreadLabel;
