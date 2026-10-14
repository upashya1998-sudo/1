export function Flourish({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 180 28" fill="none" stroke="currentColor" strokeWidth=".85" className={`flourish ${className}`} aria-hidden="true">
    <path d="M10 14H65C75 14 76 6 69 6C63 6 65 13 69 11M170 14H115C105 14 104 6 111 6C117 6 115 13 111 11M80 14 90 4 100 14 90 24 80 14Z" />
    <path d="M86 14 90 9 94 14 90 19ZM76 14C77 22 83 22 84 18M104 14C103 22 97 22 96 18" />
    <circle cx="6" cy="14" r="1.2" /><circle cx="174" cy="14" r="1.2" />
  </svg>;
}

export function Corner({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 70 70" fill="none" stroke="currentColor" strokeWidth=".8" className={`corner-ornament ${className}`} aria-hidden="true">
    <path d="M5 64V5H64M12 51V12H51M16 16C29 15 37 26 31 34C24 45 14 37 19 31C23 26 30 32 26 35M16 16C15 29 26 37 34 31C45 24 37 14 31 19C26 23 32 30 35 26M18 18 48 48M35 35C41 27 50 29 48 36C47 42 40 40 41 36M35 35C27 41 29 50 36 48C42 47 40 40 36 41M44 44 54 47 47 54 44 44Z" />
    <path d="M26 19C28 8 45 7 42 14C39 20 34 15 37 12M19 26C8 28 7 45 14 42C20 39 15 34 12 37" />
  </svg>;
}

export function CoverFiligree() {
  const Scroll = () => <g>
    <path d="M0 0C20-9 31 1 24 12C19 21 7 19 10 10C13 4 19 9 16 13M0 0C5-17 18-26 23-18C28-10 13-8 11-13M0 0C-5-17-18-26-23-18C-28-10-13-8-11-13M0 0C-20-9-31 1-24 12C-19 21-7 19-10 10C-13 4-19 9-16 13M0 0V28M0 16C-12 11-18 17-12 21C-5 27-1 20 0 16M0 16C12 11 18 17 12 21C5 27 1 20 0 16" />
    <path d="M0-2C-9-14-7-32 0-43C7-32 9-14 0-2ZM0-7V-31M0 26-7 34 0 42 7 34 0 26Z" />
  </g>;
  return <svg viewBox="0 0 400 580" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth=".9" className="cover-filigree" aria-hidden="true">
    <rect x="12" y="12" width="376" height="556" rx="2" strokeWidth="1.2" />
    <rect x="18" y="18" width="364" height="544" strokeWidth=".45" />
    <rect x="25" y="25" width="350" height="530" strokeWidth="1.3" />
    <rect x="32" y="32" width="336" height="516" strokeWidth=".5" />
    <path d="M52 86V52H106M294 52H348V86M52 494V528H106M294 528H348V494M40 40 55 55M360 40 345 55M40 540 55 525M360 540 345 525" />
    {[0, 1, 2, 3].map(i => <g key={i} transform={i === 0 ? "translate(58 60) rotate(-45) scale(.65)" : i === 1 ? "translate(342 60) rotate(45) scale(.65)" : i === 2 ? "translate(58 520) rotate(-135) scale(.65)" : "translate(342 520) rotate(135) scale(.65)"}><Scroll /></g>)}
    <g transform="translate(200 102)"><Scroll /></g>
    <g transform="translate(200 474) rotate(180)"><Scroll /></g>
    <path d="M155 119C113 117 115 150 90 163C58 180 70 213 83 225M245 119C287 117 285 150 310 163C342 180 330 213 317 225M155 457C113 459 115 426 90 413C58 396 70 363 83 351M245 457C287 459 285 426 310 413C342 396 330 363 317 351" />
    <path d="M83 225C65 235 66 259 80 271C61 285 67 311 80 320C69 333 72 345 83 351M317 225C335 235 334 259 320 271C339 285 333 311 320 320C331 333 328 345 317 351" />
    <path d="M88 204C75 188 95 177 99 190C103 201 87 206 87 195M312 204C325 188 305 177 301 190C297 201 313 206 313 195M88 372C75 388 95 399 99 386C103 375 87 370 87 381M312 372C325 388 305 399 301 386C297 375 313 370 313 381" />
    {[104, 150, 196, 242, 288, 334, 380, 426, 472].map((y, i) => <g key={y}>
      <path d={`M43 ${y + 22}C58 ${y + 3} 41 ${y - 14} 47 ${y - 23}M45 ${y}C60 ${y - 2} 61 ${y - 16} 52 ${y - 11}C43 ${y - 6} 45 ${y} 45 ${y}M43 ${y + 11}C33 ${y + 4} 37 ${y - 8} 42 ${y - 3}`} />
      <path d={`M357 ${y + 22}C342 ${y + 3} 359 ${y - 14} 353 ${y - 23}M355 ${y}C340 ${y - 2} 339 ${y - 16} 348 ${y - 11}C357 ${y - 6} 355 ${y} 355 ${y}M357 ${y + 11}C367 ${y + 4} 363 ${y - 8} 358 ${y - 3}`} />
      <circle cx="14.8" cy={y} r="1.2" /><circle cx="385.2" cy={y} r="1.2" />
      {i < 6 && <><circle cx={82 + i * 47} cy="15" r="1.2" /><circle cx={82 + i * 47} cy="565" r="1.2" /></>}
    </g>)}
    <path d="M111 42H170M230 42H289M111 538H170M230 538H289M185 42 200 36 215 42 200 48 185 42ZM185 538 200 532 215 538 200 544 185 538Z" />
  </svg>;
}
