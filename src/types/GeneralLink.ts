/** Same shape the editor's LinkPanel produces (`Link` in @genesisxplatform/domain). */
export type GeneralLink =
  | {
    type: 'url' | 'anchor';
    value: string;
    target: 'self' | 'blank';
  }
  | {
    type: 'scene';
    value: string;
    duration: number;
    animation: 'fade' | 'slide' | 'reveal';
    direction?: 'north' | 'west' | 'south' | 'east';
    offset?: number;
    mode?: 'normal' | 'reverse';
    sceneSectionId?: string;
  };
