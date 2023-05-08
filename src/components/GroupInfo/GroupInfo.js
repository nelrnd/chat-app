import Avatar from '../Avatar/Avatar';
import GroupAvatar from '../GroupAvatar/GroupAvatar';
import IconButton from '../IconButton/IconButton';
import PageHeader from '../PageHeader/PageHeader';
import ContactTab from '../ContactTab/ContactTab';
import '../ContactInfo/ContactInfo.css';
import {
  auth,
  createChat,
  updateGroupChatInfo,
  uploadProfileImage,
} from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const GroupInfo = (props) => {
  const navigate = useNavigate();

  const handleTabClick = async (uid) => {
    if (uid === auth.currentUser.uid) return;
    const userIds = [auth.currentUser.uid, uid];
    const chatId = await createChat(userIds);
    navigate(`/chats/${chatId}`);
  };

  return (
    <div className={`ContactInfo ${props.show ? 'show' : ''}`}>
      <PageHeader withBorder={false}>
        <h2>Group info</h2>
        <IconButton name="close" handleClick={props.handleClose} />
      </PageHeader>

      <section>
        {props.profileURL ? (
          <Avatar imageURL={props.profileURL} size="large" />
        ) : (
          <GroupAvatar imageURLs={props.imageURLs} size="large" />
        )}
        <h2>{props.groupName}</h2>
      </section>

      <section>
        <p>
          Members <span className="sml-txt grey">{props.members.length}</span>
        </p>
        {props.members.map((member) => (
          <ContactTab
            key={member.id}
            userId={member.id}
            handleClick={() => handleTabClick(member.id)}
          />
        ))}
      </section>
    </div>
  );
};

const EditGroupModal = ({
  chatId,
  groupName,
  profileURL,
  show,
  handleClose,
}) => {
  const [newProfileURL, setNewProfileURL] = useState(profileURL);
  const [newProfileFile, setNewProfileFile] = useState(null);
  const [newGroupName, setNewGroupName] = useState(groupName);
  const profileInput = useRef(null);

  const handleNameChange = (e) => setNewGroupName(e.target.value);

  const handleProfileChange = (e) => {
    const [file] = e.target.files;
    if (file) {
      setNewProfileFile(file);
      setNewProfileURL(URL.createObjectURL(file));
    }
  };

  const handleRemoveProfile = () => {
    setNewProfileFile(null);
    setNewProfileURL(null);
    profileInput.current.value = null;
  };

  const clearFields = () => {
    setNewProfileURL(profileURL);
    setNewGroupName(groupName);
    profileInput.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedInfo = {};
      if (newProfileFile) {
        const imageURL = await uploadProfileImage(newProfileFile, chatId);
        updatedInfo.profileURL = imageURL;
        setNewProfileURL(imageURL);
      }
      if (newProfileURL === null) {
        updatedInfo.photoURL = '';
      }
      if (newGroupName !== groupName) {
        updatedInfo.groupName = newGroupName;
      }
      await updateGroupChatInfo(chatId, updatedInfo);
      clearFields();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (show) {
      setNewGroupName(groupName);
      setNewProfileURL(profileURL);
    }
  }, [show, groupName, profileURL]);

  return <p></p>;
};

export default GroupInfo;
