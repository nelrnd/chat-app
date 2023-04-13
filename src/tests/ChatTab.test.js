import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatTab from '../components/ChatTab';

const props = {
  name: 'Jaden',
  lastMessage: { text: 'Perfect!', date: '16m' },
  imageUrl:
    'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?cs=srgb&dl=pexels-mohamed-abdelghaffar-771742.jpg&fm=jpg',
  unreadMessages: ['a', 'b', 'c'],
};

it('renders name correctly', () => {
  render(
    <ChatTab
      name={props.name}
      lastMessage={props.lastMessage}
      imageUrl={props.imageUrl}
      unreadMessages={props.unreadMessages}
    />
  );
  const name = screen.getByRole('heading');
  expect(name.textContent).toContain('Jaden');
});

it('renders last message correctly', () => {
  render(
    <ChatTab
      name={props.name}
      lastMessage={props.lastMessage}
      imageUrl={props.imageUrl}
      unreadMessages={props.unreadMessages}
    />
  );
  const message = screen.getByText(/Perfect!/);
  expect(message).toBeInTheDocument();
});

it('renders correct number of unread messages', () => {
  render(
    <ChatTab
      name={props.name}
      lastMessage={props.lastMessage}
      imageUrl={props.imageUrl}
      unreadMessages={props.unreadMessages}
    />
  );
  const unread = screen.getByText(/3/);
  expect(unread).toBeInTheDocument();
});

it('renders 9+ unread messages if more than 9', () => {
  const unreadProp = [];
  for (let i = 0; i < 15; i++) {
    unreadProp.push('item');
  }
  render(
    <ChatTab
      name={props.name}
      lastMessage={props.lastMessage}
      imageUrl={props.imageUrl}
      unreadMessages={unreadProp}
    />
  );
  const unread = screen.getByText(/9+/);
  expect(unread).toBeInTheDocument();
});
