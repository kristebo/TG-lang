export const TG_PROGRAM_MODES = ['text', 'canvas'] as const
export type ProgramMode = (typeof TG_PROGRAM_MODES)[number]

export const TG_COLOR_CHANNELS = ['onsdag', 'torsdag', 'fredag'] as const
export type ColorChannel = (typeof TG_COLOR_CHANNELS)[number]

export const DEFAULT_CANVAS_RESOLUTION = 16
export const TG_COLOR_CHANNEL_MAX = 15

export const TG_RESERVED_WORDS = [
  'vikingskip',
  'hovedscene',
  'piksel',
  'innsjekk',
  'søndag',
  'arne',
  'rop',
  'infodesk',
  'crew',
  'deltager',
  'kandu',
  'kandustyre',
  'medic',
  'foam',
  'maof',
  'kanalseks',
  'secbua',
  'ombud',
  'hylle',
  'tech',
  'sovetelt',
  'attentiongrab',
  'pall',
  'lørdag',
  'premiumparkering',
  'trafikklys',
  'expo',
  'seating',
  'noc',
  'kreativia',
  'onsdag',
  'torsdag',
  'fredag',
] as const

export const TG_RESERVED_WORD_SET = new Set<string>(TG_RESERVED_WORDS)

export const BINARY_OPERATOR_WORDS = {
  equality: {
    kanalseks: '==',
  },
  comparison: {
    foam: '<',
    maof: '>',
  },
  additive: {
    crew: '+',
    deltager: '-',
  },
  multiplicative: {
    kandu: '*',
    medic: '/',
    kandustyre: '%',
  },
} as const
