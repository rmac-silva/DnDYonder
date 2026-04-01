import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import TerminalIcon from '@mui/icons-material/Terminal';

export default function Links() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const theme = useTheme();

  const colors = {
    background: '#ffffff',
    textDefault: '#333333',
    textHover: theme.palette.primary.main,
  };

  const linkStyle = (linkId) => ({
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: hoveredLink === linkId ? colors.textHover : colors.textDefault,
    transform: hoveredLink === linkId ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'all 0.2s ease',
  });

  const iconContainerStyle = (linkId) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.35rem 0.5rem',
    borderRadius: '0.5rem',
    backgroundColor: hoveredLink === linkId ? '#3a3a3a' : 'rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
  });

  const iconStyle = {
    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
    transition: 'color 0.2s ease',
  };

  return (
    <footer className="w-full mt-auto bg-white py-3 md:py-4 border-t border-gray-200 z-10">
      <div className="flex flex-row flex-wrap justify-center gap-x-3 sm:gap-x-6 md:gap-x-8 gap-y-2 text-xs sm:text-sm md:text-base px-2 md:px-4">
        <a
          href="https://github.com/rmac-silva/"
          style={linkStyle('github')}
          onMouseEnter={() => setHoveredLink('github')}
          onMouseLeave={() => setHoveredLink(null)}
          onTouchStart={() => setHoveredLink('github')}
          onTouchEnd={() => setHoveredLink(null)}
          aria-label="Go to my github page"
        >
          <div style={iconContainerStyle('github')} className="flex flex-row space-x-2">
            <GitHubIcon style={iconStyle} />
          <span>rmac-silva</span>
          </div>
        </a>

        <a
          href="mailto:rmac.silva@campus.fct.unl.pt"
          style={linkStyle('email')}
          onMouseEnter={() => setHoveredLink('email')}
          onMouseLeave={() => setHoveredLink(null)}
          onTouchStart={() => setHoveredLink('email')}
          onTouchEnd={() => setHoveredLink(null)}
          aria-label="Send me an email"
        >
          <div style={iconContainerStyle('email')} className="flex flex-row space-x-2">
            <EmailIcon style={iconStyle} />
          <span>rmac-silva</span>
          </div>
        </a>

        <a
          href="https://dev.blazy.uk"
          style={linkStyle('personal')}
          onMouseEnter={() => setHoveredLink('personal')}
          onMouseLeave={() => setHoveredLink(null)}
          onTouchStart={() => setHoveredLink('personal')}
          onTouchEnd={() => setHoveredLink(null)}
          aria-label="Go to my personal website"
        >
          <div style={iconContainerStyle('personal')} className="flex flex-row space-x-2">
            <TerminalIcon style={iconStyle} />
          <span>dev.blazy.uk</span>
          </div>
        </a>

        <a
          href="https://ko-fi.com/rmacsilva"
          style={linkStyle('kofi')}
          onMouseEnter={() => setHoveredLink('kofi')}
          onMouseLeave={() => setHoveredLink(null)}
          onTouchStart={() => setHoveredLink('kofi')}
          onTouchEnd={() => setHoveredLink(null)}
          aria-label="Go to my Ko-fi page"
        >
          <div style={iconContainerStyle('kofi')} className="flex flex-row space-x-2">
            <i className="fa-brands fa-ko-fi" style={iconStyle}></i>
          <span>ko-fi/rmac-silva</span>
          </div>
        </a>
      </div>
    </footer>
  );
}