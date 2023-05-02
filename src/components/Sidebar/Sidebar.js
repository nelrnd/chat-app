import './Sidebar.css';
import logoImg from '../../assets/images/logo.png';
import IconButton from '../IconButton/IconButton';
import TextInput from '../TextInput/TextInput';
import { useState } from 'react';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChagne = (e) => setSearchTerm(e.target.event);

  return (
    <div className="Sidebar">
      <header>
        <img src={logoImg} alt="BooChat logo" />

        <div className="row gap-16">
          <IconButton name="new" />
          <IconButton name="settings" />
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
