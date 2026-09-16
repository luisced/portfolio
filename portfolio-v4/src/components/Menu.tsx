import StaggeredMenu from '@/components/reactbits/StaggeredMenu/StaggeredMenu';

interface Props {
  items: Array<{ label: string; ariaLabel: string; link: string }>;
  socials: Array<{ label: string; link: string }>;
}

export default function Menu({ items, socials }: Props) {
  return (
    <StaggeredMenu
      position="right"
      isFixed
      items={items}
      socialItems={socials}
      displaySocials
      displayItemNumbering
      logoUrl="/mark.svg"
      colors={['#1a1a1a', '#c8ff00']}
      menuButtonColor="#f1efe8"
      openMenuButtonColor="#0a0a0a"
      accentColor="#c8ff00"
      changeMenuColorOnOpen
      closeOnClickAway
    />
  );
}
