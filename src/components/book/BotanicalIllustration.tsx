import type { SVGProps } from "react";

function Leaf({ x, y, rotate = 0, scale = 1 }: { x: number; y: number; rotate?: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <path d="M0 0C-22-4-39-19-45-37C-21-35-5-18 0 0ZM0 0-37-31M-10-9-25-11M-17-15-29-21M-24-21-31-29" />
    <path d="M-5-4C-15-12-23-20-35-28" opacity=".35" />
  </g>;
}

function Blossom({ x, y, scale = 1, rotate = 0, rose = false }: { x: number; y: number; scale?: number; rotate?: number; rose?: boolean }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    {rose ? <>
      <path d="M-3-7C-17-22-27-11-28-1C-45 5-32 24-20 25C-18 40 2 38 10 28C27 35 42 15 29 5C33-13 18-28 7-20C2-33-18-34-21-19" />
      <path d="M-16-13C-33-8-21 7-12 8C-21 23-5 29 3 19C16 28 30 9 18 1C25-12 8-20 2-10C-5-20-13-17-16-13Z" />
      <path d="M-10-2C-14 9 1 13 6 7C17 0 6-10 1-6C-5-12-15-8-10-2ZM-4-3C4-7 9 3 2 6C-4 8-8 2-4-3Z" />
      <path d="M-30 8-23 12M-27 15-21 19M-13 29-10 22M18 23 14 17M26 11 20 9M18-15 13-11M-12-24-8-18" opacity=".65" />
    </> : <>
      {[0, 60, 120, 180, 240, 300].map(angle => <g key={angle} transform={`rotate(${angle})`}>
        <path d="M-3-3C-16-14-16-28-6-30C3-33 10-19 3-3C1-4-1-4-3-3Z" />
        <path d="M0-7C-1-14-5-23-5-26M-6-11-9-22" opacity=".5" />
      </g>)}
      <circle r="5" /><circle r="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} d="M0 3 0 7" transform={`rotate(${a})`} />)}
    </>}
  </g>;
}

function Bud({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <path d="M0 8C-14 2-14-11-7-23C-3-19 0-16 1-16C3-20 6-24 8-24C15-9 13 3 0 8Z" />
    <path d="M0 8C-6-3-3-15 1-16M0 8C5-4 8-10 8-20M0 10-10 2M0 10 11 0M0 8 0 20" />
    <path d="M-8-13-5-6M8-11 6-3" opacity=".5" />
  </g>;
}

export default function BotanicalIllustration({ stage = 3, className = "", ...props }: SVGProps<SVGSVGElement> & { stage?: number }) {
  return <svg viewBox="0 0 240 300" fill="none" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" className={`botanical botanical-${stage} ${className}`} aria-hidden="true" {...props}>
    {stage === 1 && <>
      <path d="M121 278C128 220 112 169 122 108M123 200C99 176 96 151 90 137M121 240C137 209 148 184 154 163" />
      <Bud x={121} y={94} /><Bud x={87} y={118} rotate={-24} />
      <Leaf x={122} y={218} rotate={-7} /><Leaf x={127} y={252} rotate={113} scale={.9} /><Leaf x={122} y={170} rotate={100} scale={.6} />
      <path d="M153 162C156 153 161 147 168 144C169 155 164 161 153 162Z" />
    </>}
    {stage === 2 && <>
      <path d="M113 281C101 230 151 189 133 141C125 119 98 103 89 84M129 281C148 232 102 202 116 165C124 142 145 130 151 100" />
      <Blossom x={85} y={79} scale={.67} rotate={-16} /><Blossom x={156} y={93} scale={.67} rotate={22} />
      <Leaf x={117} y={209} rotate={-10} /><Leaf x={132} y={231} rotate={112} /><Leaf x={123} y={153} rotate={-20} scale={.7} />
      <path d="M107 257C128 254 143 245 140 231" />
    </>}
    {stage === 3 && <>
      <path d="M115 282C128 231 112 183 122 116M120 205C145 191 151 177 161 166M120 240C95 216 85 199 80 182" />
      <Blossom x={121} y={84} rose scale={1.1} rotate={-8} />
      <path d="M119 125 106 115 112 108M119 124 137 113 132 108" />
      <Leaf x={120} y={229} /><Leaf x={123} y={184} rotate={118} /><Leaf x={83} y={187} rotate={-30} scale={.8} />
      <Bud x={166} y={155} rotate={38} />
    </>}
    {stage === 4 && <>
      <path d="M126 280C131 237 142 179 129 129C119 91 82 85 77 118M130 209C108 187 104 164 92 147" />
      <Blossom x={77} y={130} scale={.8} rotate={-37} />
      <Leaf x={133} y={235} rotate={-5} /><Leaf x={132} y={189} rotate={120} /><Leaf x={111} y={163} rotate={-27} scale={.7} />
      <path d="M77 119 66 109M77 117 90 112" />
    </>}
    {stage === 5 && <>
      <path d="M119 287C85 250 163 224 126 178C98 143 102 111 128 83C146 63 140 47 127 36M118 264C62 253 57 215 75 186C87 166 105 164 111 145M132 224C177 214 184 180 166 160C154 146 140 146 132 132" />
      <Blossom x={127} y={45} scale={.63} /><Blossom x={73} y={184} scale={.5} /><Blossom x={166} y={155} scale={.5} />
      <Leaf x={107} y={258} rotate={-38} scale={.8} /><Leaf x={136} y={230} rotate={117} /><Leaf x={119} y={182} rotate={12} scale={.75} /><Leaf x={113} y={137} rotate={-12} scale={.7} /><Leaf x={122} y={102} rotate={116} scale={.65} />
      <path d="M86 225C62 232 64 209 76 213C86 217 78 224 74 220M155 195C178 198 176 177 165 181C153 185 165 194 168 188" />
    </>}
    {stage === 6 && <>
      <path d="M89 284C109 234 143 192 146 143C148 113 151 101 165 84M129 206C99 177 80 164 61 162M139 176C166 158 187 141 199 119" />
      <Blossom x={168} y={75} rose scale={1.04} rotate={29} />
      <Leaf x={113} y={244} rotate={-28} /><Leaf x={129} y={210} rotate={130} /><Leaf x={143} y={158} rotate={-22} />
      <Bud x={63} y={154} rotate={-55} />
      <path d="M104 255 99 244 111 247M132 200 130 188 138 194M144 148 137 138 146 139M120 220 132 215 126 226M86 171 83 159 94 167" />
    </>}
    {stage === 7 && <>
      <path d="M119 280C131 229 112 182 121 123C125 103 123 84 116 70" />
      <path d="M116 87C97 86 90 75 92 59C104 63 112 68 116 87ZM116 88C129 78 132 65 123 49C116 58 110 72 116 88ZM116 90C135 93 145 86 149 73C136 72 126 78 116 90Z" />
      <Leaf x={122} y={220} rotate={-7} /><Leaf x={124} y={261} rotate={113} scale={.75} />
      <path d="M122 146C107 131 95 131 84 140C93 151 108 154 122 146Z" opacity=".7" />
      <path d="M158 106C171 112 177 123 171 135C156 129 152 120 158 106Z" opacity=".7" />
      <path d="M184 166C195 164 205 171 208 180C198 188 185 179 184 166Z" opacity=".45" />
      <path d="M160 218C163 207 174 201 183 204C183 215 171 222 160 218Z" opacity=".25" />
      <path d="M201 253C211 250 220 253 223 260C216 268 206 265 201 253Z" opacity=".14" />
    </>}
    <path d="M106 286C115 282 124 285 133 281M110 290C116 287 126 290 130 287" opacity=".45" />
  </svg>;
}
