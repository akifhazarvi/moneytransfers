// Line icons on a 20px grid, 1.6 stroke, currentColor — drawn to sit with the
// system font the way SF Symbols do.

const svg = (body, extra = "") =>
  `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}>${body}</svg>`;

export const ICON = {
  chevronDown: svg('<path d="M5.5 8l4.5 4.5L14.5 8"/>'),
  chevronRight: svg('<path d="M8 5.5l4.5 4.5L8 14.5"/>'),
  swap: svg('<path d="M7 3.5v13M7 3.5L4 6.5M7 3.5l3 3M13 16.5v-13M13 16.5l-3-3M13 16.5l3-3"/>'),
  gear: svg('<circle cx="10" cy="10" r="2.6"/><path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1L4.7 4.7"/>'),
  bell: svg('<path d="M5.5 13.5V9a4.5 4.5 0 019 0v4.5l1.5 1.5h-12z"/><path d="M8.3 17a1.9 1.9 0 003.4 0"/>'),
  bellFill: svg('<path d="M5.5 13.5V9a4.5 4.5 0 019 0v4.5l1.5 1.5h-12z" fill="currentColor"/><path d="M8.3 17a1.9 1.9 0 003.4 0"/>'),
  star: svg('<path d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z"/>'),
  starFill: svg('<path d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z" fill="currentColor"/>'),
  copy: svg('<rect x="7" y="7" width="9.5" height="9.5" rx="2"/><path d="M13 7V5a1.5 1.5 0 00-1.5-1.5h-6A1.5 1.5 0 004 5v6.5A1.5 1.5 0 005.5 13H7"/>'),
  link: svg('<path d="M8.5 11.5a3.2 3.2 0 004.6 0l2.6-2.6a3.2 3.2 0 00-4.6-4.6l-1 1"/><path d="M11.5 8.5a3.2 3.2 0 00-4.6 0l-2.6 2.6a3.2 3.2 0 004.6 4.6l1-1"/>'),
  check: svg('<path d="M4.5 10.5l3.5 3.5 7.5-8"/>'),
  external: svg('<path d="M11.5 3.5h5v5M16.5 3.5L9.5 10.5"/><path d="M14.5 11.5v3.5a1.5 1.5 0 01-1.5 1.5H5a1.5 1.5 0 01-1.5-1.5V7A1.5 1.5 0 015 5.5h3.5"/>'),
  close: svg('<path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/>'),
  search: svg('<circle cx="8.8" cy="8.8" r="5"/><path d="M12.5 12.5l4 4"/>'),
  plus: svg('<path d="M10 4.5v11M4.5 10h11"/>'),
  tag: svg('<path d="M3.5 10.2V4.8a1.3 1.3 0 011.3-1.3h5.4l6.3 6.3a1.3 1.3 0 010 1.8l-5.4 5.4a1.3 1.3 0 01-1.8 0z"/><circle cx="7" cy="7" r="1.1" fill="currentColor" stroke="none"/>'),
  pin: svg('<path d="M10 17.5s5.5-4.9 5.5-9.3a5.5 5.5 0 00-11 0c0 4.4 5.5 9.3 5.5 9.3z"/><circle cx="10" cy="8.2" r="1.9"/>'),
  clock: svg('<circle cx="10" cy="10" r="7"/><path d="M10 6v4.2l2.8 1.7"/>'),
  trend: svg('<path d="M3 14l4.5-4.5 3 3L17 6M12.5 6H17v4.5"/>'),
  info: svg('<circle cx="10" cy="10" r="7"/><path d="M10 9v4.5M10 6.5v.01"/>'),
  wifiOff: svg('<path d="M3 3l14 14M8.2 8.3A8 8 0 003 10.6M12.6 8.6a8 8 0 014.4 2M5.6 13a5 5 0 016.5-.9M10 16.2v.01"/>'),
};
