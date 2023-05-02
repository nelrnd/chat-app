import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';
import IconButton from '../IconButton/IconButton';
import TextInput from '../TextInput/TextInput';
import './Sidebar.css';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchTermChagne = (e) => setSearchTerm(e.target.event);

  const goToSettings = () => navigate('/settings');

  return (
    <div className="Sidebar">
      <header>
        <img src={logoImg} alt="BooChat logo" />

        <div className="row gap-16">
          <IconButton name="new" />
          <IconButton name="settings" handleClick={goToSettings} />
        </div>
      </header>

      <section className="search">
        <TextInput
          icon="search"
          placeholder="Search"
          value={searchTerm}
          handleChange={handleSearchTermChagne}
        />
      </section>
    </div>
  );
};

export default Sidebar;
